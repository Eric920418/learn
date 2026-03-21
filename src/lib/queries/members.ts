import { db } from "@/lib/db";
import { associationMembers } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

export async function getAssociationMembers() {
  return db.select().from(associationMembers).orderBy(asc(associationMembers.sortOrder));
}

export async function getMemberById(id: string) {
  const [member] = await db
    .select()
    .from(associationMembers)
    .where(eq(associationMembers.id, id))
    .limit(1);
  return member || null;
}
