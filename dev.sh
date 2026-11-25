#!/bin/bash
# Dev server management for this site.
#
#   ./dev.sh start     start the Vite dev server in the background
#   ./dev.sh stop      stop it
#   ./dev.sh restart   stop + start
#   ./dev.sh rebuild   stop, clear caches, reinstall deps if needed, start
#   ./dev.sh build     production build into build/ (add "github" for GitHub Pages mode)
#   ./dev.sh status    show whether it is running
#   ./dev.sh logs      follow the server log (Ctrl+C to stop following)

set -u
cd "$(dirname "$0")" || exit 1

PORT="${PORT:-5173}"
STATE_DIR=".dev"
PID_FILE="$STATE_DIR/server.pid"
LOG_FILE="$STATE_DIR/server.log"
URL="http://localhost:$PORT"

mkdir -p "$STATE_DIR"

is_running() {
  [[ -f "$PID_FILE" ]] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null
}

port_pids() {
  lsof -ti "tcp:$PORT" -sTCP:LISTEN 2>/dev/null
}

kill_tree() {
  local pid=$1 child
  for child in $(pgrep -P "$pid" 2>/dev/null); do
    kill_tree "$child"
  done
  kill "$pid" 2>/dev/null
}

start() {
  if is_running; then
    echo "Already running (PID $(cat "$PID_FILE")) at $URL"
    return 0
  fi
  if [[ -n "$(port_pids)" ]]; then
    echo "Port $PORT is busy (PID $(port_pids | tr '\n' ' ')). Run './dev.sh stop' or set PORT=…" >&2
    return 1
  fi
  [[ -d node_modules ]] || npm install || return 1

  echo "Starting dev server on $URL ..."
  nohup npm run dev -- --port "$PORT" --strictPort >"$LOG_FILE" 2>&1 &
  echo $! >"$PID_FILE"

  # Wait up to ~20s for the port to open.
  for _ in $(seq 1 40); do
    if [[ -n "$(port_pids)" ]]; then
      echo "Running (PID $(cat "$PID_FILE")) — $URL"
      echo "Log: $LOG_FILE"
      return 0
    fi
    if ! is_running; then break; fi
    sleep 0.5
  done
  echo "Dev server failed to start. Last log lines:" >&2
  tail -n 20 "$LOG_FILE" >&2
  rm -f "$PID_FILE"
  return 1
}

stop() {
  local stopped=0
  if is_running; then
    kill_tree "$(cat "$PID_FILE")"
    stopped=1
  fi
  rm -f "$PID_FILE"

  # Clean up anything left listening on the port (e.g. a server started by hand).
  local pids
  pids=$(port_pids)
  if [[ -n "$pids" ]]; then
    echo "$pids" | xargs kill 2>/dev/null
    stopped=1
  fi

  for _ in $(seq 1 20); do
    [[ -z "$(port_pids)" ]] && break
    sleep 0.25
  done
  [[ -n "$(port_pids)" ]] && port_pids | xargs kill -9 2>/dev/null

  if (( stopped )); then echo "Stopped."; else echo "Not running."; fi
}

rebuild() {
  stop
  echo "Clearing caches (.svelte-kit, node_modules/.vite) ..."
  rm -rf .svelte-kit node_modules/.vite
  if [[ ! -d node_modules || package-lock.json -nt node_modules/.package-lock.json ]]; then
    echo "Installing dependencies ..."
    npm install || return 1
  fi
  npx svelte-kit sync
  start
}

build() {
  if [[ "${1:-}" == "github" ]]; then
    npm run build:github
  else
    npm run build
  fi
}

status() {
  if is_running; then
    echo "Running (PID $(cat "$PID_FILE")) — $URL"
  elif [[ -n "$(port_pids)" ]]; then
    echo "Not managed by this script, but port $PORT is in use by PID $(port_pids | tr '\n' ' ')"
  else
    echo "Not running."
  fi
}

case "${1:-}" in
  start)   start ;;
  stop)    stop ;;
  restart) stop; start ;;
  rebuild) rebuild ;;
  build)   build "${2:-}" ;;
  status)  status ;;
  logs)    touch "$LOG_FILE"; tail -f "$LOG_FILE" ;;
  *)
    sed -n '2,10p' "$0" | sed 's/^# \{0,1\}//'
    exit 1
    ;;
esac
