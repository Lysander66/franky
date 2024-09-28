package router

import (
	"os"

	"github.com/Lysander66/franky/internal/database"
	"github.com/Lysander66/franky/internal/handler"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/logger"
	"gorm.io/gorm"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api/v1", logger.New())

	SetupAnimationRoutes(app, database.DB)

	api.Post("/download", handler.Download)

	app.Get("/api/v8/live/mediaList", func(c fiber.Ctx) error {
		location := os.Getenv("MEDIA_SERVER_IP") + string(c.Request().RequestURI())
		return c.Redirect().To(location)
	})
}

func SetupAnimationRoutes(app *fiber.App, db *gorm.DB) {
	h := &handler.AnimationHandler{DB: db}

	r := app.Group("/api/v1/animation", logger.New())
	r.Get("/", h.GetAll)
	r.Get("/:id", h.GetOne)
	r.Post("/", h.Upsert)
	r.Patch("/:id", h.Upsert)
	r.Delete("/:id", h.Delete)
}
