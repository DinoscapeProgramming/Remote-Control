#!/bin/bash

USER_NAME=$(whoami)
PROGRAM_PATH="/home/$USER_NAME/.local/share/Remote Control"
UNINSTALLER_PATH="$PROGRAM_PATH/Uninstall Remote Control"
SERVER_DIR=$(dirname "$(dirname "$(dirname "$(realpath "$0")")")")/server

cd "$SERVER_DIR" || exit
npm install
node . 