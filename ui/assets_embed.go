package ui

import (
	"embed"
	"io/fs"
	"net/http"
)

//go:embed all:build
var distDir embed.FS

func FS() http.FileSystem {
	stripped, err := fs.Sub(distDir, "build")
	if err != nil {
		panic(err)
	}
	return http.FS(stripped)
}
