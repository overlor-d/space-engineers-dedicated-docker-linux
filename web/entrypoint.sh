#!/bin/sh
set -e
COMPOSE_FILE=/workspace/docker-compose.yml
stop_server() {
  echo "Stopping server container..."
  docker compose -f $COMPOSE_FILE stop se-server >/dev/null 2>&1 || true
}
trap stop_server TERM INT
node /app/server.js &
wait $!
