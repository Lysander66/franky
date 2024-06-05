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

func Response(status int, msg string, data any) *fiber.Map {
	return &fiber.Map{"status": status, "msg": msg, "data": data}
}

func SuccessResponse(data any) *fiber.Map {
	return &fiber.Map{"status": 0, "data": data, "msg": ""}
}

func SuccessResponseNil() *fiber.Map {
	return &fiber.Map{"status": 0, "data": "", "msg": ""}
}

func SuccessResponseT[T Integer](items any, total T) *fiber.Map {
	return &fiber.Map{
		"status": 0,
		"data": fiber.Map{
			"items": items,
			"total": total,
		},
		"msg": "",
	}
}

func ErrorResponse(err error, msg ...string) *fiber.Map {
	if len(msg) > 0 {
		return &fiber.Map{"status": statusError, "msg": msg[0], "data": err}
	}
	return &fiber.Map{"status": statusError, "msg": err.Error(), "data": nil}
}
