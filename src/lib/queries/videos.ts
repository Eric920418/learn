import { db } from "@/lib/db";
import { videos } from "@/lib/db/schema";
import { asc, desc, eq } from "drizzle-orm";

// sortOrder 相同時 Postgres 不保證回傳順序，配上 force-dynamic 會出現
// 「重新整理後卡片自己換位置」。補一個 createdAt 當決勝欄位讓排序有決定性。
// （既有的 getAllAlbums 沒有這個保護，是相簿的既有問題，這裡不複製它。）
const VIDEO_ORDER = [asc(videos.sortOrder), desc(videos.createdAt)] as const;

export async function getAllVideos() {
  return db.select().from(videos).orderBy(...VIDEO_ORDER);
}

export async function getPublishedVideos() {
  return db
    .select()
    .from(videos)
    .where(eq(videos.published, true))
    .orderBy(...VIDEO_ORDER);
}

export async function getVideoById(id: string) {
  const [video] = await db
    .select()
    .from(videos)
    .where(eq(videos.id, id))
    .limit(1);
  return video || null;
}
