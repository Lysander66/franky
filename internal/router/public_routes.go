package router

import (
	"bufio"
	"encoding/json"
	"fmt"

	v1 "github.com/Lysander66/franky/internal/api/v1"
	"github.com/Lysander66/franky/internal/handler"
	"github.com/gofiber/fiber/v3"
)

func PublicRoutes(app *fiber.App) {
	api := app.Group("/api/v1")

	api.Post("/download", func(c fiber.Ctx) error {
		req := &v1.DownloadReq{}
		err := c.Bind().Body(req)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "error", "message": err})
		}

		progressChan := make(chan *handler.Progress)

		c.Set("Content-Type", "text/event-stream")
		c.Set("Cache-Control", "no-cache")
		c.Set("Connection", "keep-alive")
		c.Set("Transfer-Encoding", "chunked")
		c.Set("Access-Control-Allow-Origin", "*")
		c.Set("Access-Control-Allow-Headers", "Cache-Control")
		c.Set("Access-Control-Allow-Credentials", "true")
		c.Context().SetBodyStreamWriter(func(w *bufio.Writer) {
			for {
				select {
				case progress, ok := <-progressChan:
					if !ok {
						msg, _ := json.Marshal(&handler.Progress{Completed: 1})
						fmt.Fprintf(w, "data: %s\n\n", msg)
						w.Flush()
						return
					}
					msg, _ := json.Marshal(progress)
					fmt.Fprintf(w, "data: %s\n\n", msg)
					w.Flush()
				}
			}
		})

		go func() {
			handler.DownloadHls(req, progressChan)
			close(progressChan)
		}()

		return nil
	})

}
