package handler

import (
	"errors"
	"strconv"

	v1 "github.com/Lysander66/franky/api/v1"
	"github.com/Lysander66/franky/internal/model"
	"github.com/gofiber/fiber/v3"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type AnimationHandler struct {
	DB *gorm.DB
}

func (h *AnimationHandler) GetAll(c fiber.Ctx) error {
	var entities []model.Animation

	query := h.DB

	if platform := c.Query("PlaybackPlatform"); platform != "" {
		query = query.Where("playback_platform = ?", platform)
	}

	if weekdayStr := c.Query("Weekday"); weekdayStr != "" {
		weekday, err := strconv.Atoi(weekdayStr)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid weekday parameter"})
		}
		query = query.Where("weekly_update_time @> ?", pq.Array([]int{weekday}))
	}

	result := query.Find(&entities)
	if result.Error != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch animations"})
	}

	return c.JSON(entities)
}

func (h *AnimationHandler) GetOne(c fiber.Ctx) error {
	id := c.Params("id")
	var entity model.Animation
	if err := h.DB.First(&entity, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Animation not found"})
	}
	return c.JSON(entity)
}

func (h *AnimationHandler) Upsert(c fiber.Ctx) error {
	var entity model.Animation
	err := c.Bind().Body(&entity)
	if err != nil {
		return c.Status(400).JSON(v1.ErrorResponse(err))
	}

	if entity.ID != 0 {
		var existing model.Animation
		if err := h.DB.First(&existing, entity.ID).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return c.Status(404).JSON(fiber.Map{"error": "Animation not found"})
			}
			return c.Status(500).JSON(fiber.Map{"error": "Database error"})
		}
	}

	if err := h.DB.Save(&entity).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to save animation"})
	}

	return c.JSON(entity)
}

func (h *AnimationHandler) Delete(c fiber.Ctx) error {
	id := c.Params("id")
	if err := h.DB.Delete(&model.Animation{}, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Animation not found"})
	}
	return c.SendStatus(204)
}
