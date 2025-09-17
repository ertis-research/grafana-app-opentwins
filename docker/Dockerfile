FROM golang:1.24.5 AS go-build

# Install packages
RUN go install github.com/magefile/mage@v1.15.0

COPY ./ /var/lib/grafana/plugins/grafana-app-opentwins

WORKDIR /var/lib/grafana/plugins/grafana-app-opentwins

RUN mage -v build:backend

FROM ghcr.io/atnog/grafana:route25-beta.1

USER 0

RUN apt update && apt install -y --no-install-recommends \
    npm netcat gettext-base jq && \
    npm install -g yarn && \
    npm install -g n && \
    n 18 && \
    apt clean && rm -rf /var/lib/apt/lists/*

COPY grafana.ini /etc/grafana/grafana.ini

RUN mkdir -p /var/lib/grafana/plugins/grafana-app-opentwins
COPY ./ /var/lib/grafana/plugins/grafana-app-opentwins
COPY --from=go-build /var/lib/grafana/plugins/grafana-app-opentwins/dist /var/lib/grafana/plugins/grafana-app-opentwins/dist
RUN cd /var/lib/grafana/plugins/grafana-app-opentwins/src/ && yarn install

RUN mkdir -p /home/grafana_user
# COPY ./templates /home/grafana_user/templates

WORKDIR /usr/share/grafana
COPY docker/run_all.sh .

ENTRYPOINT ["./run_all.sh"]