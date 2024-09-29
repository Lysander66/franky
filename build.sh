#!/bin/bash

APP_NAME="m3u8dl"
VERSION="1.0.0"

mkdir -p build

GOOS=darwin GOARCH=amd64 go build -o build/${APP_NAME}-${VERSION}-darwin-amd64
GOOS=darwin GOARCH=arm64 go build -o build/${APP_NAME}-${VERSION}-darwin-arm64

GOOS=windows GOARCH=amd64 go build -o build/${APP_NAME}-${VERSION}-win-amd64.exe
GOOS=windows GOARCH=arm64 go build -o build/${APP_NAME}-${VERSION}-win-arm64.exe

echo "Build complete. Executables are in the 'build' directory."
