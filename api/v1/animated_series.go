package v1

type AnimatedSeries struct {
	ID               int
	Name             string
	Link             string
	Episode          int
	PublishTime      string
	WeeklyUpdateTime []int64
	Production       string
	PlaybackPlatform string
	Novel            string
	EventId          string //
	Type             string //Action, Adventure, Fantasy ...
	Description      string
	Rating           float32
	BadgeText        string
	BadgeLevel       string
}
