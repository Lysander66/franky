package router

import (
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
		go handler.DownloadHls(req)
		return c.JSON(fiber.Map{"status": "success", "data": nil})
	})

}
