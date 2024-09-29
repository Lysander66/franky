package handler

import (
	"bufio"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"net/url"
	"os"
	"path"
	"strings"

	v1 "github.com/Lysander66/franky/api/v1"
	"github.com/Lysander66/zephyr/pkg/stream"
	"github.com/gofiber/fiber/v3"
)

func Download(c fiber.Ctx) error {
	req := &v1.DownloadReq{}
	err := c.Bind().Body(req)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(v1.ErrorResponse(err))
	}

	if req.Filename == "" {
		name, err := extractNameFromURL(req.URL)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(v1.ErrorResponse(err))
		}
		req.Filename = strings.TrimSuffix(name, path.Ext(name))
	}
	if req.Directory == "" {
		homeDir, err := os.UserHomeDir()
		if err != nil {
			return c.Status(500).JSON(v1.ErrorResponse(err))
		}
		req.Directory = path.Join(homeDir, "Downloads", req.Filename)
	}
	if req.Proxy != "none" {
		os.Setenv("http_proxy", "http://127.0.0.1:7890")
		os.Setenv("https_proxy", "http://127.0.0.1:7890")
		os.Setenv("all_proxy", "socks5://127.0.0.1:7890")
	} else {
		os.Unsetenv("http_proxy")
		os.Unsetenv("https_proxy")
		os.Unsetenv("all_proxy")
	}

	dl := stream.NewHLSDownloader(req.URL, req.Filename, req.Directory, req.Threads)

	go func() {
		err = dl.Download()
		if err != nil {
			slog.Error("Download", "err", err)
			return
		}
	}()

	c.Set("Content-Type", "text/event-stream")
	c.Set("Cache-Control", "no-cache")
	c.Set("Connection", "keep-alive")
	c.Set("Transfer-Encoding", "chunked")
	c.Set("Access-Control-Allow-Origin", "*")
	c.Set("Access-Control-Allow-Headers", "Cache-Control")
	c.Set("Access-Control-Allow-Credentials", "true")
	c.Context().SetBodyStreamWriter(func(w *bufio.Writer) {
		for progress := range dl.ProgressCh {
			msg, _ := json.Marshal(progress)
			fmt.Fprintf(w, "data: %s\n\n", msg)
			w.Flush()
		}
		fmt.Fprint(w, "data: {\"completed\": 1}\n\n")
		w.Flush()
	})

	return nil
}

func extractNameFromURL(rawURL string) (string, error) {
	u, err := url.Parse(rawURL)
	if err != nil {
		return "", err
	}

	return path.Base(u.Path), nil
}
