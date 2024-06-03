package model

import "time"

type AnimeInfo struct {
	ID          int64
	Name        string
	Link        string
	Type        string
	Description string
	Rating      float32 `sql:"type:decimal(8,4)"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
