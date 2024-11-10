#!/bin/bash

while [[ "$1" =~ ^-- ]]; do
  case "$1" in
    --amount=*)
      count="${1#*=}"
      ;;
    *)
      echo "Invalid argument: $1"
      exit 1
      ;;
  esac
  shift
done

if [[ -z "$count" ]]; then
  read -p "Enter the number of ghost updates to publish: " count
fi

if ! [[ "$count" =~ ^[0-9]+$ ]] || [ "$count" -le 0 ]; then
  echo "Please enter a valid positive number."
  exit 1
fi

packagePath="$(pwd)"

cd "$packagePath" || exit

for ((i=1; i<=count; i++)); do
  npm version patch --no-git-tag-version
  npm publish --access public
  sleep 2
done

echo "All ghost updates published."