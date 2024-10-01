package router

import (
	"io"
	"net/http"
	"os"
	"strconv"

	"github.com/Lysander66/franky/internal/database"
	"github.com/Lysander66/franky/internal/handler"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/logger"
	"gorm.io/gorm"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api/v1", logger.New())

	animationRoutes(app, database.DB)

	api.Post("/download", handler.Download)

	api.Get("/weather/:id", weatherHandler)

	app.Get("/api/v8/live/mediaList", func(c fiber.Ctx) error {
		location := os.Getenv("MEDIA_SERVER_IP") + string(c.Request().RequestURI())
		return c.Redirect().To(location)
	})
}

func weatherHandler(c fiber.Ctx) error {
	url := "https://weather.cma.cn/api/weather/view?stationid="
	if stationid, _ := strconv.Atoi(c.Params("id")); stationid > 0 {
		url += c.Params("id")
	}

	resp, err := http.Get(url)
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}

	c.Set("Content-Type", resp.Header.Get("Content-Type"))
	return c.Status(resp.StatusCode).Send(body)
}

func animationRoutes(app *fiber.App, db *gorm.DB) {
	h := &handler.AnimationHandler{DB: db}

	r := app.Group("/api/v1/animation", logger.New())
	r.Get("/", h.GetAll)
	r.Get("/:id", h.GetOne)
	r.Post("/", h.Upsert)
	r.Patch("/:id", h.Upsert)
	r.Delete("/:id", h.Delete)
}
