import { db } from "@/lib/db";
import { galleryAlbums, galleryPhotos } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

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

export async function getPhotosByAlbumId(albumId: string) {
  return db
    .select()
    .from(galleryPhotos)
    .where(eq(galleryPhotos.albumId, albumId))
    .orderBy(asc(galleryPhotos.sortOrder));
}
