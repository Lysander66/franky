package main

import (
	"log"
	"log/slog"

	"github.com/Lysander66/franky/internal/database"
	"github.com/Lysander66/franky/internal/handler"
	"github.com/Lysander66/franky/internal/router"
	"github.com/Lysander66/zephyr/pkg/logger"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/recover"
)

func main() {
	slog.SetDefault(logger.New(slog.LevelInfo))

	database.ConnectDB()

	app := fiber.New()
	app.Use(cors.New(), recover.New())
	router.SetupRoutes(app)
	app.Use(handler.NotFound)

	log.Fatal(app.Listen(":3000"))
}
