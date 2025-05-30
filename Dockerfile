FROM grafana/grafana:10.3.1-ubuntu

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
RUN mkdir -p /home/grafana_user
COPY ./templates /home/grafana_user/templates

WORKDIR /usr/share/grafana
COPY run_all.sh .

ENTRYPOINT ["./run_all.sh"]
