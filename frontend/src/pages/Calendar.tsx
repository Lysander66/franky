import { getEvents } from '../lib/events.ts'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'

export default function Calendar() {
  return (
    <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
        initialView="listWeek"
        headerToolbar={{
          left: 'dayGridMonth timeGridWeek listWeek',
          center: 'title',
          right: 'today prev,next',
        }}
        events={getEvents()}
      />
    </main>
  )
}
