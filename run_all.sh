#!/bin/sh

chown -R 472:472 /var/lib/grafana/plugins

cd /var/lib/grafana/plugins/grafana-app-opentwins/src/

yarn install
yarn dev &

until nc -z localhost 35729; do
  echo "Waiting for plugin dev server (port 35729) to be ready..."
  sleep 1
done
#sleep 5

cd /usr/share/grafana/
/run.sh
