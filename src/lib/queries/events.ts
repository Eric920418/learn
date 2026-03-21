import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

export async function getPublishedEvents() {
  return db
    .select()
    .from(events)
    .where(eq(events.published, true))
    .orderBy(asc(events.sortOrder));
}

export async function getAllEvents() {
  return db.select().from(events).orderBy(asc(events.sortOrder));
}

export async function getEventById(id: string) {
  const [event] = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return event || null;
}
