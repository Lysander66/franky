package model

import (
	"time"

	"github.com/lib/pq"
)

var AnimatedSeriesDao = new(AnimatedSeries)

type AnimatedSeries struct {
	ID               int
	Name             string `gorm:"uniqueIndex"`
	Link             string
	Episode          int
	PublishTime      string
	WeeklyUpdateTime pq.Int64Array `gorm:"type:int[]"`
	Production       string
	PlaybackPlatform string
	Novel            string
	EventId          string //
	Type             string //Action, Adventure, Fantasy ...
	Description      string
	Rating           float32   `sql:"type:decimal(8,4)"`
	CreatedAt        time.Time `gorm:"<-:create"`
	UpdatedAt        time.Time
}

func (a AnimatedSeries) FindAll(platform string) ([]*AnimatedSeries, error) {
	db := DB
	var list []*AnimatedSeries
	if platform != "" {
		db = db.Where("playback_platform = ?", platform)
	}
	err := db.Find(&list).Error
	return list, err
}
