#!/bin/bash

# demo.sh - Launches the frontend and Flask server for demo purposes.
#
# Usage: ./demo.sh [options]
#
# Make sure to run this script from the root directory of the project

session="Podplistic Demo"
flask_pane=0
frontend_pane=1

tmux new-session -d -s "${session}"
tmux rename-window -t 0 "Main"
tmux split-window -h

tmux send-keys -t "${flask_pane}" "cd flask && python3 server.py" Enter
tmux send-keys -t "${frontend_pane}" "cd frontend && npm start" Enter

tmux attach-session -t "${session}"
