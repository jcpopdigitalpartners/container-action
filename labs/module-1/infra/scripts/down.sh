#!/usr/bin/env bash
set -euo pipefail
name="course-${LAB_ENV:?}"
podman rm -f "$name-api" "$name-db" 2>/dev/null || true
podman network rm "$name-net" 2>/dev/null || true
echo "Disposable containers/network removed. Persistent volume $name-data intentionally retained."
