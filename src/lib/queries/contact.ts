import { db } from "@/lib/db";
import { contactPersons } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export async function getContactPersons() {
  return db
    .select()
    .from(contactPersons)
    .orderBy(asc(contactPersons.sortOrder));
}

export async function getContactPersonById(id: string) {
  const [person] = await db
    .select()
    .from(contactPersons)
    .where(eq(contactPersons.id, id))
    .limit(1);
  return person || null;
}
