import { db } from "@/lib/db";
import { heroContent } from "@/lib/db/schema";

export async function getHeroContent() {
  const [hero] = await db.select().from(heroContent).limit(1);
  return hero || null;
}
