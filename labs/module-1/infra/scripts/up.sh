#!/usr/bin/env bash
set -euo pipefail
name="course-${LAB_ENV:?}"
port="${LAB_PORT:?}"
image="${LAB_IMAGE:?}"
# Disposable example credentials only. Never use these in production.
podman network exists "$name-net" || podman network create "$name-net"
podman volume exists "$name-data" || podman volume create "$name-data"
podman run -d --name "$name-db" --network "$name-net" \
  -v "$name-data:/var/lib/postgresql/data" \
  -e POSTGRES_DB=course -e POSTGRES_USER=course \
  -e POSTGRES_PASSWORD=coursepass postgres:17
for attempt in $(seq 1 35); do
  if podman exec "$name-db" pg_isready -U course -d course >/dev/null 2>&1; then break; fi
  sleep 1
done
podman run -d --name "$name-api" --network "$name-net" -p "$port:3000" \
  -e DB_HOST="$name-db" -e DB_USER=course \
  -e DB_PASSWORD=coursepass -e DB_NAME=course "$image"
printf 'API URL: http://localhost:%s\n' "$port"
