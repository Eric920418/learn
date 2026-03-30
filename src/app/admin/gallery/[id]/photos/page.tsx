import Link from "next/link";
import { redirect } from "next/navigation";
import { getAlbumWithPhotos } from "@/lib/queries/gallery";
import {
  addPhotosToAlbum,
  updatePhoto,
  deletePhoto,
} from "@/lib/actions/gallery";
import { PhotoManager } from "@/components/admin/PhotoManager";

export default async function PhotosManagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const album = await getAlbumWithPhotos(id);

  if (!album) redirect("/admin/gallery");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/admin/gallery"
            className="text-sm text-blue-600 hover:underline"
          >
            ← 返回相簿列表
          </Link>
          <h1 className="text-2xl font-bold mt-1">
            管理照片 — {album.title}
          </h1>
          <p className="text-sm text-gray-500">{album.eventDate}</p>
        </div>
        <Link
          href={`/admin/gallery/${id}`}
          className="px-4 py-2 text-sm text-white rounded-md"
          style={{ backgroundColor: "var(--primary-navy)" }}
        >
          編輯相簿資訊
        </Link>
      </div>

      <PhotoManager
        albumId={id}
        photos={album.photos}
        addPhotos={addPhotosToAlbum}
        updatePhoto={updatePhoto}
        deletePhoto={deletePhoto}
      />
    </div>
  );
}
