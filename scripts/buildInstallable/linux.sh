#!/bin/bash

USER_NAME=$(whoami)
PROGRAM_PATH="/home/$USER_NAME/.local/share/Remote Control"
UNINSTALLER_PATH="$PROGRAM_PATH/Uninstall Remote Control"
CLIENT_DIR=$(dirname "$(dirname "$(dirname "$(realpath "$0")")")")/client

if [ -d "$BUILD_PATH" ]; then
  rm -f "$BUILD_PATH"/*.exe
fi

cd "$CLIENT_DIR" || exit
npm install
npm run buildLinux --prod