############################################
# Stage 1 — Build Grafana from source (v12.1.0)
############################################
FROM ubuntu:24.04 AS grafana-build

ENV GRAFANA_VERSION=12.1.0
ENV DEBIAN_FRONTEND=noninteractive

# --- OS deps ---
RUN apt-get update && apt-get install -y \
    git curl ca-certificates wget make build-essential gnupg \
 && rm -rf /var/lib/apt/lists/*

# --- Go 1.22.x ---
RUN wget https://go.dev/dl/go1.22.6.linux-amd64.tar.gz \
 && rm -rf /usr/local/go && tar -C /usr/local -xzf go1.22.6.linux-amd64.tar.gz \
 && rm go1.22.6.linux-amd64.tar.gz
ENV PATH="/usr/local/go/bin:${PATH}"

# --- Node.js 22 (required for --experimental-strip-types) + Yarn via Corepack ---
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
 && apt-get update && apt-get install -y nodejs \
 && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare yarn@stable --activate && yarn --version

# --- Clone Grafana source ---
RUN git clone --depth 1 https://github.com/ATNoG/grafana.git /grafana
WORKDIR /grafana

ENV TS_NODE_TRANSPILE_ONLY=1
ENV TS_NODE_COMPILER_OPTIONS='{"module":"es2015"}'

# --- Build backend & frontend ---
RUN make build-go && make deps-js && make build-js


############################################
# Stage 2 — Build plugin backend with Mage
############################################
FROM golang:1.24.5 AS go-build

# Install packages
RUN go install github.com/magefile/mage@v1.15.0

COPY ./ /plugin

WORKDIR /plugin

RUN mage -v build:backend


############################################
# Stage 3 — Runtime image
############################################
FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

# netcat
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl gettext-base jq \  
 && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
 && apt-get update && apt-get install -y nodejs \
 && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare yarn@stable --activate && yarn --version 

RUN mkdir -p /etc/grafana /var/lib/grafana /var/log/grafana /usr/share/grafana /var/lib/grafana/plugins

# ---- Copy built Grafana from Stage 1 ----
# Home layout under /usr/share/grafana
COPY --from=grafana-build /grafana/bin /usr/share/grafana/bin
COPY --from=grafana-build /grafana/public /usr/share/grafana/public
COPY --from=grafana-build /grafana/conf /usr/share/grafana/conf

COPY grafana.ini /etc/grafana/grafana.ini

RUN mkdir -p /var/lib/grafana/plugins/grafana-app-opentwins
COPY ./ /var/lib/grafana/plugins/grafana-app-opentwins
COPY --from=go-build /plugin/dist /var/lib/grafana/plugins/grafana-app-opentwins/dist

RUN cd /var/lib/grafana/plugins/grafana-app-opentwins/src/ && yarn install

RUN mkdir -p /home/grafana_user
COPY ./templates /home/grafana_user/templates

WORKDIR /usr/share/grafana
COPY run_all.sh .

# Set paths
ENV GF_PATHS_HOME=/usr/share/grafana \
    GF_PATHS_CONFIG=/etc/grafana/grafana.ini \
    GF_PATHS_DATA=/var/lib/grafana \
    GF_PATHS_LOGS=/var/log/grafana \
    GF_PATHS_PLUGINS=/var/lib/grafana/plugins

EXPOSE 3000 

USER 0

ENTRYPOINT ["./run_all.sh"]