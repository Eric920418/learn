import { db } from "@/lib/db";
import { aboutAims, aboutDirectors, aboutPurposes } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function getAims() {
  return db.select().from(aboutAims).orderBy(asc(aboutAims.sortOrder));
}

export async function getDirectors() {
  return db.select().from(aboutDirectors).orderBy(asc(aboutDirectors.sortOrder));
}

export async function getPurposes() {
  return db.select().from(aboutPurposes).orderBy(asc(aboutPurposes.sortOrder));
}
