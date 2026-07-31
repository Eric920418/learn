import Link from "next/link";
import { getAllVideos } from "@/lib/queries/videos";
import { deleteVideo } from "@/lib/actions/videos";
import { VideoListClient } from "./video-list";

export default async function VideosAdminPage() {
  const videos = await getAllVideos();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">影片管理</h1>
        <Link
          href="/admin/videos/new"
          className="px-4 py-2 text-sm text-white rounded-md"
          style={{ backgroundColor: "var(--primary-navy)" }}
        >
          新增影片
        </Link>
      </div>
      <VideoListClient videos={videos} deleteVideo={deleteVideo} />
    </div>
  );
}
