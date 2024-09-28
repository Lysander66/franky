package router

import (
	"github.com/Lysander66/franky/internal/handler"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/logger"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api/v1", logger.New())

	api.Get("/", handler.Hello)

	api.Post("/download", handler.Download)
}
