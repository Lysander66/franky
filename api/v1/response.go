package v1

import (
	"github.com/gofiber/fiber/v3"
)

const (
	ErrCodeSuccess = 0
	ErrCodeFailure = -1
)

type Integer interface {
	~int | ~int8 | ~int16 | ~int32 | ~int64 | ~uint | ~uint8 | ~uint16 | ~uint32 | ~uint64
}

func Response(code int, message string, data any) *fiber.Map {
	return &fiber.Map{"code": code, "message": message, "data": data}
}

func SuccessResponse(data any) *fiber.Map {
	return &fiber.Map{"code": ErrCodeSuccess, "data": data, "message": ""}
}

func SuccessResponseNil() *fiber.Map {
	return &fiber.Map{"code": 0, "data": "", "message": ""}
}

func SuccessResponseT[T Integer](items any, total T) *fiber.Map {
	return &fiber.Map{
		"code": ErrCodeSuccess,
		"data": fiber.Map{
			"items": items,
			"total": total,
		},
		"message": "",
	}
}

func ErrorResponse(err error, msg ...string) *fiber.Map {
	if len(msg) > 0 {
		return &fiber.Map{"code": ErrCodeFailure, "message": msg[0], "data": err}
	}
	return &fiber.Map{"code": ErrCodeFailure, "message": err.Error(), "data": nil}
}
