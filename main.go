package main

import (
	"log"
	"log/slog"

	"github.com/Lysander66/franky/internal/model"

	"github.com/Lysander66/ace/pkg/logger"
	"github.com/Lysander66/franky/internal/handler"
	"github.com/Lysander66/franky/internal/router"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	logger2 "github.com/gofiber/fiber/v3/middleware/logger"
	"github.com/gofiber/fiber/v3/middleware/recover"
)

func main() {
	slog.SetDefault(logger.New(slog.LevelInfo))

	model.ConnectDB()

	app := fiber.New(fiber.Config{
		ServerHeader:  "Fiber",
		StrictRouting: true,
		CaseSensitive: true,
		AppName:       "Test App v1.0.1",
	})

	app.Use(logger2.New())
	app.Use(cors.New(), recover.New())
	router.PublicRoutes(app)
	app.Use(handler.NotFound)

	log.Fatal(app.Listen(":3000"))
}
