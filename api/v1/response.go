package v1

import (
	"github.com/gofiber/fiber/v3"
)

const (
	statusError = -1
)

type Integer interface {
	~int | ~int8 | ~int16 | ~int32 | ~int64 | ~uint | ~uint8 | ~uint16 | ~uint32 | ~uint64
}

type Response struct {
	Status int    `json:"status"`
	Msg    string `json:"msg"`
	Data   any    `json:"data"`
}

type RespItems struct {
	Items any `json:"items"`
	Total int `json:"total"`
}

func Success(c fiber.Ctx, data any) error {
	return c.JSON(Response{Data: data})
}

func SuccessT[T Integer](c fiber.Ctx, data any, total T) error {
	return c.JSON(Response{Data: RespItems{Items: data, Total: int(total)}})
}

func Error(c fiber.Ctx, err error, msg ...string) error {
	resp := Response{Status: statusError, Data: err}
	if len(msg) > 0 {
		resp.Msg = msg[0]
	} else {
		resp.Msg = err.Error()
	}
	return c.JSON(resp)
}

func NotFound(c fiber.Ctx, msg string) error {
	return c.JSON(Response{Status: 404, Msg: msg})
	//return c.Status(http.StatusNotFound).JSON(Response{Status: 404, Msg: msg})
}
