package plugin

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"maps"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/ATNoG/grafana-app-opentwins/pkg/models"
	"github.com/gorilla/websocket"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/httpclient"
	"github.com/grafana/grafana-plugin-sdk-go/backend/instancemgmt"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/data"
)

// Make sure Datasource implements required interfaces. This is important to do
// since otherwise we will only get a not implemented error response from plugin in
// runtime. In this example datasource instance implements backend.QueryDataHandler,
// backend.CheckHealthHandler interfaces. Plugin should not implement all these
// interfaces - only those which are required for a particular task.
var (
	_ backend.QueryDataHandler      = (*Datasource)(nil)
	_ backend.CheckHealthHandler    = (*Datasource)(nil)
	_ instancemgmt.InstanceDisposer = (*Datasource)(nil)
)

// Datasource for eclipse ditto.
type Datasource struct {
	settings   *models.PluginSettings
	httpClient *http.Client

	wsTaskStatus atomic.Int32 // 0 - Not started, 1 - Started, 2 - Terminating

	// Map of the Thing ID to a map of the values received by message
	messages     map[string]map[string]json.RawMessage
	messagesLock sync.RWMutex
}

// Wrapper around the values map because ditto passes the value field of the
// message as a string instead of the original map
type wsValueWrapper map[string]json.RawMessage

func (w *wsValueWrapper) UnmarshalJSON(data []byte) (err error) {
	if len(data) > 1 && data[0] == '"' && data[len(data)-1] == '"' {
		var parsedString string
		err := json.Unmarshal(data, &parsedString)
		if err != nil {
			return err
		}
		data = []byte(parsedString)
	}

	var values map[string]json.RawMessage
	err = json.Unmarshal(data, &values)
	if err != nil {
		return err
	}

	*w = wsValueWrapper(values)

	return nil
}

type wsMessage struct {
	Topic string         `json:"topic"`
	Value wsValueWrapper `json:"value"`
}

// NewDatasource creates a new datasource instance.
func NewDatasource(ctx context.Context, rawSettings backend.DataSourceInstanceSettings) (instancemgmt.Instance, error) {
	settings, err := models.LoadPluginSettings(rawSettings)
	if err != nil {
		return nil, err
	}

	httpClient, err := httpclient.New(httpclient.Options{
		Header: map[string][]string{
			"Authorization": {fmt.Sprintf("Basic %s", settings.Secrets.ApiAuth)},
		},
	})
	if err != nil {
		return nil, err
	}

	ds := &Datasource{
		settings:     settings,
		httpClient:   httpClient,
		wsTaskStatus: atomic.Int32{},
		messages:     make(map[string]map[string]json.RawMessage),
	}

	ds.ensureWSTask()

	return ds, nil
}

// Dispose here tells plugin SDK that plugin wants to clean up resources when a new instance
// created. As soon as datasource settings change detected by SDK old datasource instance will
// be disposed and a new one will be created using NewSampleDatasource factory function.
func (d *Datasource) Dispose() {
	d.wsTaskStatus.Store(2)
}

// Connects to the websocket broker with automatic retries and exponential
// backoff
func (d *Datasource) connectWS() *websocket.Conn {
	var retry time.Duration = 1 * time.Second
	var err error
	var wsClient *websocket.Conn

	for {
		wsClient, _, err = websocket.DefaultDialer.Dial(d.settings.WsUrl, map[string][]string{
			"Authorization": {fmt.Sprintf("Basic %s", d.settings.Secrets.ApiAuth)},
		})

		if d.wsTaskStatus.Load() == 2 {
			return nil
		}

		if err == nil {
			break
		}

		log.DefaultLogger.Error("Websocket dial failed", "retry (seconds)", retry.Seconds(), "err", err)

		// Exponential backoff limited to a maximum of 30 seconds
		time.Sleep(retry)
		retry *= 2
		retry = min(retry, 30*time.Second)
	}

	return wsClient
}

// Spawns the websocket task at most once
func (d *Datasource) ensureWSTask() {
	// Ensure that only one task is spawned
	if !d.wsTaskStatus.CompareAndSwap(0, 1) {
		return
	}

	go func() {
		// If the function terminates and the status is still 1, swap it to 0 so
		// that it can be restarted. This is conditional on the status being 1
		// because we don't want the function to be restarted when it's
		// terminated by disposal.
		defer d.wsTaskStatus.CompareAndSwap(1, 0)

		// Loop for restarting the task in case connection is lost
		for {
			wsClient := d.connectWS()

			if wsClient == nil {
				return
			}

			defer wsClient.Close()

			err := wsClient.WriteMessage(websocket.TextMessage, []byte("START-SEND-MESSAGES"))
			if err != nil {
				log.DefaultLogger.Error("Failed to send subscribe", "err", err)
				continue
			}

			_, rawMessage, err := wsClient.ReadMessage()
			if err != nil {
				log.DefaultLogger.Error("Failed to read subscribe ACK:", "err", err)
				continue
			}

			if string(rawMessage) != "START-SEND-MESSAGES:ACK" {
				log.DefaultLogger.Error("Expected ACK (\"START-SEND-MESSAGES:ACK\")", "msg", rawMessage)
				continue
			}

			log.DefaultLogger.Info("Subscribed to messages")

			for {
				if d.wsTaskStatus.Load() == 2 {
					return
				}

				_, rawMessage, err := wsClient.ReadMessage()
				if err != nil {
					log.DefaultLogger.Error("Failed to read websocket message", "err", err)
					break
				}

				var message wsMessage

				err = json.Unmarshal(rawMessage, &message)
				if err != nil {
					log.DefaultLogger.Error("Failed to unmarshal message", "err", err)
					continue
				}

				topicParts := strings.Split(message.Topic, "/")
				if len(topicParts) < 2 {
					log.DefaultLogger.Error("Topic has less than 2 path components", "topic", message.Topic)
					continue
				}

				thingID := fmt.Sprintf("%s:%s", topicParts[0], topicParts[1])

				d.messagesLock.Lock()

				thingMessages, found := d.messages[thingID]
				if !found {
					// Create a map for the values to allow writing
					d.messages[thingID] = make(map[string]json.RawMessage)
					thingMessages = d.messages[thingID]
				}
				maps.Copy(thingMessages, message.Value)

				d.messagesLock.Unlock()
			}
		}
	}()
}

// QueryData handles multiple queries and returns multiple responses.
// req contains the queries []DataQuery (where each query contains RefID as a unique identifier).
// The QueryDataResponse contains a map of RefID to the response for each query, and each response
// contains Frames ([]*Frame).
func (d *Datasource) QueryData(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
	d.ensureWSTask()

	response := backend.NewQueryDataResponse()

	for _, q := range req.Queries {
		var res backend.DataResponse
		var qm queryModel

		// Unmarshal the JSON into our queryModel.
		err := json.Unmarshal(q.JSON, &qm)
		if err != nil {
			res = backend.ErrDataResponse(backend.StatusBadRequest, fmt.Sprintf("json unmarshal: %v", err.Error()))
		} else if qm.QueryType == "messages" {
			res = d.queryMessages(ctx, req.PluginContext, q, qm)
		} else {
			res = d.queryFeatures(ctx, req.PluginContext, q, qm)
		}

		response.Responses[q.RefID] = res
	}

	return response, nil
}

type queryModel struct {
	ThingID   string `json:"thingID"`
	QueryText string `json:"queryText"`
	QueryType string `json:"queryType"`
}

func (d *Datasource) queryMessages(_ context.Context, _ backend.PluginContext, query backend.DataQuery, qm queryModel) backend.DataResponse {
	var response backend.DataResponse

	d.messagesLock.RLock()
	rawValue, found := d.messages[qm.ThingID][qm.QueryText]
	d.messagesLock.RUnlock()

	if !found {
		return backend.ErrDataResponse(backend.StatusBadRequest, "Value not found")
	}

	// Grafana only supports float64 for alerts so we need to convert the
	// message to a number, for bools this is 0 or 1, for everything else we try
	// to parse as a float.
	var value float64
	if bytes.Equal(rawValue, []byte("true")) {
		value = 1
	} else if bytes.Equal(rawValue, []byte("false")) {
		value = 0
	} else {
		var err error
		value, err = strconv.ParseFloat(string(rawValue), 64)
		if err != nil {
			return backend.ErrDataResponse(backend.StatusBadRequest, fmt.Sprintf("float conversion: %v", err.Error()))
		}
	}

	frame := data.NewFrame("response")

	frame.Fields = append(frame.Fields,
		data.NewField("time", nil, []time.Time{time.Now()}),
		data.NewField("values", nil, []float64{value}),
	)

	response.Frames = append(response.Frames, frame)

	return response
}

func (d *Datasource) queryFeatures(ctx context.Context, _ backend.PluginContext, query backend.DataQuery, qm queryModel) backend.DataResponse {
	var response backend.DataResponse

	url, err := url.JoinPath(
		d.settings.Url,
		d.settings.Path,
		"things",
		url.PathEscape(qm.ThingID),
		"features",
		qm.QueryText,
	)
	if err != nil {
		return backend.ErrDataResponse(backend.StatusBadRequest, fmt.Sprintf("url build: %v", err.Error()))
	}

	httpReq, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return backend.ErrDataResponse(backend.StatusBadRequest, fmt.Sprintf("http request: %v", err.Error()))
	}

	resp, err := d.httpClient.Do(httpReq)
	if err != nil {
		return backend.ErrDataResponse(backend.StatusBadRequest, fmt.Sprintf("http response: %v", err.Error()))
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return backend.ErrDataResponse(backend.StatusBadRequest, fmt.Sprintf("reading body: %v", err.Error()))
	}

	var value float64

	err = json.Unmarshal(body, &value)
	if err != nil {
		return backend.ErrDataResponse(backend.StatusBadRequest, fmt.Sprintf("unmarshalling response: %v", err.Error()))
	}

	frame := data.NewFrame("response")

	frame.Fields = append(frame.Fields,
		data.NewField("time", nil, []time.Time{time.Now()}),
		data.NewField("values", nil, []float64{value}),
	)

	response.Frames = append(response.Frames, frame)

	return response
}

// CheckHealth handles health checks sent from Grafana to the plugin.
// The main use case for these health checks is the test button on the
// datasource configuration page which allows users to verify that
// a datasource is working as expected.
func (d *Datasource) CheckHealth(_ context.Context, req *backend.CheckHealthRequest) (*backend.CheckHealthResult, error) {
	// The healtchecks are being done by the frontend

	return &backend.CheckHealthResult{
		Status:  backend.HealthStatusOk,
		Message: "Data source is working",
	}, nil
}
