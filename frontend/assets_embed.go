package ui

import (
	"embed"
	"io/fs"
	"net/http"
)

//go:embed all:dist
var distDir embed.FS

func FS() http.FileSystem {
	stripped, err := fs.Sub(distDir, "dist")
	if err != nil {
		panic(err)
	}
	return http.FS(stripped)
}
