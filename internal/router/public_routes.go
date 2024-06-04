package router

import (
	"github.com/gofiber/fiber/v3"
)

func PublicRoutes(app *fiber.App) {
	api := app.Group("/api/v1")

	// Anime
	api.Get("/anime", GetAllAnimes)
	api.Post("/anime", UpsertAnime)
	api.Delete("/anime/:id", DeleteAnime)

	downloadRoutes(api)
}
