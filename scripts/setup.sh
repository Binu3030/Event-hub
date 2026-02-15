#!/usr/bin/env bash
set -e
echo "Installing server dependencies..."
cd "$(dirname "$0")/.."/server || exit 1
npm install
echo "Installing client dependencies..."
cd ../client || exit 1
npm install
echo "All dependencies installed."