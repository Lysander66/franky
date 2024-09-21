// @ts-nocheck
export function getEvents() {
	const list = []

	for (let date of getNextWeekDates()) {
		for (let v of data[date.getDay()]) {
			const item = {
				title: v.title,
				start: formatDate(date) + ' ' + v.start,
				backgroundColor: v.backgroundColor
			}
			let hour = Number.parseInt(v.start.substring(0, 2))
			hour = (hour + 1) % 24
			item.end = item.start.substring(0, 11) + (hour < 10 ? '0' + hour : hour) + v.start.substring(2)
			list.push(item)
		}
	}

	list.forEach(function (element, index, array) {
		element.id = index + 1
	})
	return list
}

// 从今天开始往后一周的日期
function getNextWeekDates() {
	const currentDate = new Date()
	const dates = [currentDate]
	for (let i = 1; i < 7; i++) {
		const nextDate = new Date(currentDate)
		nextDate.setDate(currentDate.getDate() + i)
		dates.push(nextDate)
	}
	return dates
}

// 格式化 YYYY-MM-DD
function formatDate(date) {
	const year = date.getFullYear()
	const month = (date.getMonth() + 1).toString().padStart(2, '0')
	const day = date.getDate().toString().padStart(2, '0')
	return year + '-' + month + '-' + day
}

const data = {
	0: [
		{ title: '仙武传', start: '10:00' },
		{ title: '斗破苍穹年番', start: '10:00' }
	],

	1: [{ title: '仙逆', start: '10:00' }],

	2: [{ title: '吞噬星空', start: '10:00', backgroundColor: 'green' }],

	3: [{ title: '遮天', start: '10:00' }],

	4: [
		{ title: '神印王座', start: '10:00', backgroundColor: 'green' },
		{ title: '师兄啊师兄', start: '10:00' }
	],

	5: [
		{ title: '百炼成神', start: '10:00' },
		{ title: '永生之气壮山河 ', start: '12:00' }
	],

	6: [
		{ title: '诛仙', start: '10:00' },
		{ title: '凡人修仙传', start: '11:00' }
	]
}
