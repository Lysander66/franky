package model

import "time"

var AnimeInfoDao = new(AnimeInfo)

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

func (a AnimeInfo) FindAll() ([]*AnimeInfo, error) {
	var list []*AnimeInfo
	err := DB.Find(&list).Error
	return list, err
}
