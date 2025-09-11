#!/bin/bash

chown -R 472:472 /var/lib/grafana/plugins

cd /var/lib/grafana/plugins/grafana-app-opentwins/src/

# yarn install
yarn dev &

# until nc -z localhost 35729; do
#   echo "Waiting for plugin dev server (port 35729) to be ready..."
#   sleep 1
# done
# sleep 5

# Set environment variables for Grafana
export GF_SECURITY_ALLOW_EMBEDDING="true"

/usr/share/grafana/bin/linux-amd64/grafana-server --config=/etc/grafana/grafana.ini --homepath=/usr/share/grafana &
    
GRAFANA_PID=$!
START_TIME=$(date +%s)
DATASOURCE_API_URL="http://it2s-admin:it2sit2s@localhost:3000/api/datasources"
DASHBOARD_API_URL="http://it2s-admin:it2sit2s@localhost:3000/api/dashboards/db"
HEALTH_API_URL="http://it2s-admin:it2sit2s@localhost:3000/api/health"
HEALTH_CHECK_TIMEOUT_SECONDS=300
HEALTH_CHECK_INTERVAL=5

## Check if already configures
if test -f /var/lib/grafana/setup_marker.checkpoint; 
  then
    echo "Grafana already set up, skipping imports..."
    wait $GRAFANA_PID

else
  ## Wait for API to be up
  api_ready=false
  check_grafana_health() {
      response=$(curl -s $HEALTH_API_URL)
      database_status=$(echo $response | jq -r '.database')
      if [ "$database_status" = "ok" ]; then
          echo "Grafana API is ready. Database status: $database_status"
          api_ready=true
      else
          echo "Grafana API is not ready yet."
      fi
  }

  while true; do
      current_time=$(date +%s)
      elapsed_time=$((current_time - START_TIME))
      if [ $elapsed_time -ge $HEALTH_CHECK_TIMEOUT_SECONDS ]; then
          exit 1
      fi
      
      check_grafana_health

      if [ "$api_ready" = true ]; then
          break
      fi
      sleep $HEALTH_CHECK_INTERVAL
  done

  # Create datasource
  DITTO_DATASOURCE_PAYLOAD=$(envsubst < /home/grafana_user/templates/datasources/eclipse-ditto.json)
  export DITTO_DATASOURCE_UID=""

  response=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" --location "$DATASOURCE_API_URL" \
    --header "Content-Type: application/json" \
    --data "$DITTO_DATASOURCE_PAYLOAD")

  body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')
  http_status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

  if [ "$http_status" -eq 200 ]; then
    export DITTO_DATASOURCE_UID=$(echo "$body" | jq -r '.datasource.uid')
    #echo "Datasource added successfully! UID: $DITTO_DATASOURCE_UID"
    echo "Datasource added successfully! UID: $DITTO_DATASOURCE_UID"
  else
    echo "Failed to add datasource. HTTP status: $http_status"
  fi


  ## Import Dashboards
  #for json_file in /home/grafana_user/templates/dashboards/*.json; do
    echo "Processing $json_file..."
    DASHBOARD_PAYLOAD=$(envsubst < /home/grafana_user/templates/dashboards/dittotwins.json)
    #echo "$DASHBOARD_PAYLOAD" | jq .

    response=$(curl --silent --show-error --write-out "HTTPSTATUS:%{http_code}" --location "$DASHBOARD_API_URL" \
      --header "Content-Type: application/json" \
      --user it2s-admin:it2sit2s \
      --data "$DASHBOARD_PAYLOAD")
    body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')
    http_status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

    if [ "$http_status" -eq 200 ]; then
      echo "Dashboard created successfully"
    else
      echo "Failed to create dashboard. HTTP status code: $http_status"
      echo "Response body: $body"
    fi
  #done


  touch /var/lib/grafana/setup_marker.checkpoint
  wait $GRAFANA_PID
fi