#!/usr/bin/env bash
set -e
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "Starting server in background..."
(cd "$ROOT_DIR/server" && npm run dev) &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"

echo "Starting client in background..."
(cd "$ROOT_DIR/client" && npm run dev) &
CLIENT_PID=$!
echo "Client PID: $CLIENT_PID"

wait $SERVER_PID $CLIENT_PID
echo "Both processes exited."