import { db } from "@/lib/db";
import { galleryAlbums, galleryPhotos } from "@/lib/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";

export async function getAllAlbums() {
  return db
    .select()
    .from(galleryAlbums)
    .orderBy(asc(galleryAlbums.sortOrder));
}

export async function getPublishedAlbumsWithCover() {
  return db.query.galleryAlbums.findMany({
    where: eq(galleryAlbums.published, true),
    orderBy: asc(galleryAlbums.sortOrder),
    with: {
      photos: {
        orderBy: asc(galleryPhotos.sortOrder),
        limit: 1,
        columns: { imageUrl: true },
      },
    },
  });
}

export async function getAlbumById(id: string) {
  const [album] = await db
    .select()
    .from(galleryAlbums)
    .where(eq(galleryAlbums.id, id))
    .limit(1);
  return album || null;
}

export async function getAlbumWithPhotos(id: string) {
  const album = await db.query.galleryAlbums.findFirst({
    where: eq(galleryAlbums.id, id),
    with: {
      photos: {
        orderBy: asc(galleryPhotos.sortOrder),
      },
    },
  });
  return album || null;
}

/**
 * 所有已發布相簿裡的影片，供 /videos 彙整頁使用。
 *
 * 影片沒有自己的資料表——它們是 gallery_photos 裡 mediaType='video' 的列。
 * 這裡把所屬相簿的標題與日期一起帶出來，讓彙整頁能顯示「這支影片來自哪場活動」
 * 並連回相簿。
 */
export async function getPublishedVideoMedia() {
  return db
    .select({
      id: galleryPhotos.id,
      albumId: galleryPhotos.albumId,
      albumTitle: galleryAlbums.title,
      albumEventDate: galleryAlbums.eventDate,
      imageUrl: galleryPhotos.imageUrl,
      caption: galleryPhotos.caption,
      mediaType: galleryPhotos.mediaType,
      videoUrl: galleryPhotos.videoUrl,
      youtubeId: galleryPhotos.youtubeId,
    })
    .from(galleryPhotos)
    .innerJoin(galleryAlbums, eq(galleryPhotos.albumId, galleryAlbums.id))
    .where(
      and(
        eq(galleryPhotos.mediaType, "video"),
        eq(galleryAlbums.published, true)
      )
    )
    // 相簿順序 → 相簿內順序 → createdAt 決勝，避免同 sortOrder 時每次刷新換位置
    .orderBy(
      asc(galleryAlbums.sortOrder),
      asc(galleryPhotos.sortOrder),
      desc(galleryPhotos.createdAt)
    );
}

export async function getPhotosByAlbumId(albumId: string) {
  return db
    .select()
    .from(galleryPhotos)
    .where(eq(galleryPhotos.albumId, albumId))
    .orderBy(asc(galleryPhotos.sortOrder));
}
