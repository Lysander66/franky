package router

import (
	"github.com/gofiber/fiber/v3"
)

func PublicRoutes(app *fiber.App) {
	r := app.Group("/api/v1")

	// Animated series
	r.Get("/anime", GetAllAnimatedSeries)
	r.Post("/anime", UpsertAnimatedSeries)
	r.Delete("/anime/:id", RemoveAnimatedSeries)

	downloadRoutes(r)
}
