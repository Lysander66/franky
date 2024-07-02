package router

import (
	"log/slog"
	"net/http"
	"strconv"
	"strings"

	v1 "github.com/Lysander66/franky/api/v1"
	"github.com/Lysander66/franky/internal/model"
	"github.com/gofiber/fiber/v3"
	"github.com/jinzhu/copier"
)

func intSliceContains(slice []int64, target int64) bool {
	for _, v := range slice {
		if v == target {
			return true
		}
	}
	return false
}

func GetAllAnimatedSeries(c fiber.Ctx) error {
	platform := strings.TrimSpace(c.Query("PlaybackPlatform"))
	Weekday, _ := strconv.ParseInt(c.Query("Weekday"), 10, 0)
	arr, err := model.AnimatedSeriesDao.FindAll(platform)
	if err != nil {
		slog.Error("GetAllAnimatedSeries", "err", err)
		return c.Status(http.StatusInternalServerError).JSON(v1.ErrorResponse(err))
	}
	var list []*v1.AnimatedSeries
	if Weekday > 0 {
		if Weekday == 7 {
			Weekday = 0 //TODO
		}
		for _, v := range arr {
			if intSliceContains(v.WeeklyUpdateTime, Weekday) {
				item := &v1.AnimatedSeries{}
				copier.Copy(item, v)
				list = append(list, item)
			}
		}
	} else {
		copier.Copy(&list, arr)
	}
	return c.JSON(v1.SuccessResponseT(list, len(list)))
}

func UpsertAnimatedSeries(c fiber.Ctx) error {
	requestBody := &model.AnimatedSeries{}
	err := c.Bind().Body(requestBody)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(v1.ErrorResponse(err))
	}
	err = model.DB.Save(&requestBody).Error
	if err != nil {
		slog.Error("UpsertAnimatedSeries", "err", err, "requestBody", requestBody)
		return c.JSON(v1.ErrorResponse(err, "Couldn't create Animated series"))
	}
	return c.JSON(v1.SuccessResponseNil())
}

func RemoveAnimatedSeries(c fiber.Ctx) error {
	id := c.Params("id")
	db := model.DB
	var entity model.AnimatedSeries
	db.First(&entity, id)
	if entity.ID == 0 {
		return c.JSON(v1.Response(404, "No anime with ID", nil))
	}
	db.Delete(&entity)
	return c.JSON(v1.SuccessResponseNil())
}
