import { redirect } from "next/navigation";
import { getVideoById } from "@/lib/queries/videos";
import { VideoForm } from "./video-form";

export default async function VideoEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  const video = isNew ? null : await getVideoById(id);

  if (!isNew && !video) redirect("/admin/videos");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {isNew ? "新增影片" : "編輯影片"}
      </h1>
      <VideoForm video={video} />
    </div>
  );
}
