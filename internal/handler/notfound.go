package handler

import "github.com/gofiber/fiber/v3"

// NotFound renders the 404 view
func NotFound(c fiber.Ctx) error {
	return c.Status(fiber.StatusNotFound).Render("404", nil)
}
