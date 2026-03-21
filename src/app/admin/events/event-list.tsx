"use client";

import Link from "next/link";
import { DeleteButton } from "@/components/admin/DeleteButton";

interface Event {
  id: string;
  titleCn: string;
  titleEn: string;
  date: string;
  published: boolean;
  sortOrder: number;
}

export function EventListClient({
  events,
  deleteEvent,
}: {
  events: Event[];
  deleteEvent: (id: string) => Promise<{ error?: string }>;
}) {
  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div key={event.id} className="bg-white p-4 rounded-lg border flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{event.titleCn}</span>
              <span className={`px-2 py-0.5 text-xs rounded ${event.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                {event.published ? "已發布" : "草稿"}
              </span>
            </div>
            <p className="text-sm text-gray-500">{event.date} | {event.titleEn}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/admin/events/${event.id}`} className="px-3 py-1 text-xs text-blue-600 border border-blue-300 rounded hover:bg-blue-50">
              編輯
            </Link>
            <DeleteButton onDelete={() => deleteEvent(event.id)} itemName="此活動" />
          </div>
        </div>
      ))}
      {events.length === 0 && <p className="text-gray-500 text-sm">尚無活動</p>}
    </div>
  );
}
