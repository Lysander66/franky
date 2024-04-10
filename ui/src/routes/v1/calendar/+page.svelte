<script>
	import { getEvents } from '$lib/events.js'
	import Calendar from '@event-calendar/core'
	import DayGrid from '@event-calendar/day-grid'
	import TimeGrid from '@event-calendar/time-grid'
	import List from '@event-calendar/list'

	let ec
	let plugins = [TimeGrid, DayGrid, List]
	let options = {
		view: 'dayGridMonth',
		slotDuration: '01:00',
		firstDay: 1,
		headerToolbar: {
			start: 'prev,next,today',
			center: 'title',
			end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
		},
		eventSources: [{ events: () => getEvents() }]
		// eventSources: [{ url: 'http://localhost:8180/events' }]
	}
</script>

<svelte:head>
	<title>追剧日历</title>
</svelte:head>

<Calendar bind:this={ec} {plugins} {options} />
