import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import { useState } from "react"
import { CreatePostForm } from "./CreatePostForm"

export function Planner() {
  const [createPostFormOpen, setCreatePostFormOpen] = useState(false)
  
  return (
    <div style={{ height: "100%" }}>
      <FullCalendar
        height={"100%"}
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="timeGridWeek"
        nowIndicator={true}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: 'myCustomButton dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={[
          { title: "New Event", allDay: false, start: "2024-11-24T10:00:00"},
          { title: "New Event", allDay: false, start: "2024-11-24T10:30:00"},
          { title: "New Event", allDay: false, start: "2024-11-24T10:45:00"},
        ]}
        customButtons={{
          myCustomButton: {
            text: "Create Post" ,
            click: function() { setCreatePostFormOpen(true) },
          }
        }}
      />
      <CreatePostForm open={createPostFormOpen} onClose={() => setCreatePostFormOpen(false)} />
      
    </div>
  )
}
