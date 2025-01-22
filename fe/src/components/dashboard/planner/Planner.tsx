import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import { useEffect, useState } from "react"
import { CreatePostForm } from "./CreatePostForm"
import { LoadingOverlay } from "@mantine/core"
import { handleGetPosts } from "./handlers/handleGetPosts"

export function Planner() {
  const [createPostFormOpen, setCreatePostFormOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState([])

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true)
      const { events } = await handleGetPosts()
      setEvents(events)
      setLoading(false)
    }
    fetchPosts()
  },[])

  return (
    <div style={{ height: "100%", userSelect: "none"}}>
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
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
        events={events}
        customButtons={{
          myCustomButton: {
            text: "Create Post",
            click: function () { setCreatePostFormOpen(true) },
          }
        }}
      />
      <CreatePostForm open={createPostFormOpen} onClose={() => setCreatePostFormOpen(false)} />

    </div>
  )
}
