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
	{ value: 1, label: '周一' },
	{ value: 2, label: '周二' },
	{ value: 3, label: '周三' },
	{ value: 4, label: '周四' },
	{ value: 5, label: '周五' },
	{ value: 6, label: '周六' },
	{ value: 0, label: '周日' }
]
