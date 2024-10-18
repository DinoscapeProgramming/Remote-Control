#!/bin/bash

USER_NAME=$(whoami)
PROGRAM_PATH="/home/$USER_NAME/.local/share/Remote Control"
UNINSTALLER_PATH="$PROGRAM_PATH/Uninstall Remote Control"
CLIENT_DIR=$(dirname "$(dirname "$(dirname "$(realpath "$0")")")")/client
BUILD_PATH="$CLIENT_DIR/build"
EXE_PATH="$BUILD_PATH/Remote Control Setup 1.0.0.run"

cd "$CLIENT_DIR" || exit
sudo "$EXEPATH"