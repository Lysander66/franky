interface Option<T> {
	value: T
	label: string
}

export const Apps: Option<string>[] = [
	{ value: 'esport', label: '电竞' },
	{ value: 'sport', label: '体育' }
]

export const PlaybackPlatforms: Option<string>[] = [
	{ value: 'bilibili', label: '哔哩哔哩' },
	{ value: 'iqiyi', label: '爱奇艺' },
	{ value: 'youku', label: '优酷' },
	{ value: 'qq', label: '腾讯' }
]

export const Weekdays: ReadonlyArray<Option<number>> = [
	{ value: 1, label: 'Monday' },
	{ value: 2, label: 'Tuesday' },
	{ value: 3, label: 'Wednesday' },
	{ value: 4, label: 'Thursday' },
	{ value: 5, label: 'Friday' },
	{ value: 6, label: 'Saturday' },
	{ value: 0, label: 'Sunday' }
]
