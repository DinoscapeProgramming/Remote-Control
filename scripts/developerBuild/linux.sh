#!/bin/bash

USER_NAME=$(whoami)
PROGRAM_PATH="/home/$USER_NAME/.local/share/Remote Control"
UNINSTALLER_PATH="$PROGRAM_PATH/Uninstall Remote Control"
CLIENT_DIR=$(dirname "$(dirname "$(dirname "$(realpath "$0")")")")/client
BUILD_PATH="$CLIENT_DIR/build"
EXE_PATH="$BUILD_PATH/Remote Control Setup 1.0.0.run"

pkill -f "Remote Control" 2>/dev/null

while pgrep -f "Remote Control" > /dev/null; do
    sleep 1
done

if [ -f "$UNINSTALLER_PATH" ]; then
    "$UNINSTALLER_PATH" --silent
fi

if [ -d "$PROGRAM_PATH" ]; then
    rm -rf "$PROGRAM_PATH"
fi

if [ -d "$BUILD_PATH" ]; then
    rm -f "$BUILD_PATH"/*.exe
fi

cd "$CLIENT_DIR" || exit
npm run build

npx ./scriptSelector.js