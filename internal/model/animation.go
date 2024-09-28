package model

import (
	"time"

	"github.com/lib/pq"
)

type Animation struct {
	ID               int
	Name             string `gorm:"uniqueIndex"`
	Link             string
	Episode          int
	PublishTime      string
	WeeklyUpdateTime pq.Int64Array `gorm:"type:int[]"`
	Studio           string
	PlaybackPlatform string
	Novel            string
	EventId          string
	Description      string
	Rating           float32   `sql:"type:decimal(3,1)"`
	CreatedAt        time.Time `gorm:"<-:create"`
	UpdatedAt        time.Time
}
