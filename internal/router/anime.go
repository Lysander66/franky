package router

import (
	"log/slog"

	v1 "github.com/Lysander66/franky/api/v1"
	"github.com/Lysander66/franky/internal/model"
	"github.com/gofiber/fiber/v3"
)

func GetAllAnimes(c fiber.Ctx) error {
	list, err := model.AnimeInfoDao.FindAll()
	if err != nil {
		slog.Error("GetAllAnimes", "err", err)
		return v1.Error(c, err)
	}
	return v1.SuccessT(c, list, len(list))
}

func UpsertAnime(c fiber.Ctx) error {
	req := &model.AnimeInfo{}
	err := c.Bind().Body(req)
	if err != nil {
		slog.Error("UpsertAnime", "err", err, "req", req)
		return v1.Error(c, err, "Couldn't create anime")
	}
	model.DB.Save(&req)
	return v1.Success(c, req)
}

func DeleteAnime(c fiber.Ctx) error {
	id := c.Params("id")
	db := model.DB
	var anime model.AnimeInfo
	db.First(&anime, id)
	if anime.ID == 0 {
		return v1.NotFound(c, "No anime with ID")
	}
	db.Delete(&anime)
	return v1.Success(c, nil)
}
