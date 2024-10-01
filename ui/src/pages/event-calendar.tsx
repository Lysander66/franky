import { getEvents } from '@/lib/events'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'

export const EventCalendar = () => {
	return (
		<main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
			<FullCalendar
				plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
				initialView="listWeek"
				headerToolbar={{
					left: 'dayGridMonth timeGridWeek listWeek',
					center: 'title',
					right: 'today prev,next'
				}}
				events={getEvents()}
			/>
		</main>
	)
}
