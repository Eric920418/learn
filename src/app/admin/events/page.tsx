import Link from "next/link";
import { getAllEvents } from "@/lib/queries/events";
import { deleteEvent } from "@/lib/actions/events";
import { EventListClient } from "./event-list";

export default async function EventsAdminPage() {
  const events = await getAllEvents();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">活動管理</h1>
        <Link
          href="/admin/events/new"
          className="px-4 py-2 text-sm text-white rounded-md"
          style={{ backgroundColor: "var(--primary-navy)" }}
        >
          新增活動
        </Link>
      </div>
      <EventListClient events={events} deleteEvent={deleteEvent} />
    </div>
  );
}
