package router

import (
	"os"

	"github.com/gofiber/fiber/v3"
)

func PublicRoutes(app *fiber.App) {
	app.Get("/api/v8/live/mediaList", func(c fiber.Ctx) error {
		location := os.Getenv("MEDIA_SERVER_IP") + string(c.Request().RequestURI())
		return c.Redirect().To(location)
	})

	r := app.Group("/api/v1")

	// Animated series
	r.Get("/anime", GetAllAnimatedSeries)
	r.Post("/anime", UpsertAnimatedSeries)
	r.Delete("/anime/:id", RemoveAnimatedSeries)

	downloadRoutes(r)
}
