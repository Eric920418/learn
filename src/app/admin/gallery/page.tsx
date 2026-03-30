import Link from "next/link";
import { getAllAlbums } from "@/lib/queries/gallery";
import { deleteAlbum } from "@/lib/actions/gallery";
import { AlbumListClient } from "./album-list";

export default async function GalleryAdminPage() {
  const albums = await getAllAlbums();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">活動錦集管理</h1>
        <Link
          href="/admin/gallery/new"
          className="px-4 py-2 text-sm text-white rounded-md"
          style={{ backgroundColor: "var(--primary-navy)" }}
        >
          新增相簿
        </Link>
      </div>
      <AlbumListClient albums={albums} deleteAlbum={deleteAlbum} />
    </div>
  );
}
