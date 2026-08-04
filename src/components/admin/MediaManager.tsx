"use client";

import { useState, useTransition } from "react";
import { MultiImageUpload } from "./MultiImageUpload";
import { VideoUpload } from "./VideoUpload";
import { ImageUpload } from "./ImageUpload";
import { FormField } from "./FormField";
import { SubmitButton } from "./SubmitButton";
import { ErrorDisplay } from "./ErrorDisplay";
import { DeleteButton } from "./DeleteButton";

interface Media {
  id: string;
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
  mediaType: string;
  videoUrl: string | null;
  youtubeId: string | null;
}

type ActionResult = { error?: string; warning?: string };

interface MediaManagerProps {
  albumId: string;
  media: Media[];
  addPhotos: (albumId: string, urls: string[]) => Promise<ActionResult>;
  addVideo: (albumId: string, formData: FormData) => Promise<ActionResult>;
  updatePhoto: (formData: FormData) => Promise<ActionResult>;
  deletePhoto: (id: string, albumId: string) => Promise<ActionResult>;
}

export function MediaManager({
  albumId,
  media,
  addPhotos,
  addVideo,
  updatePhoto,
  deletePhoto,
}: MediaManagerProps) {
  // 刪除成功後那張卡片會消失，所以 Blob 清理失敗的警告要掛在列表層才看得到
  const [warning, setWarning] = useState("");

  async function handleDelete(id: string) {
    const result = await deletePhoto(id, albumId);
    if (result?.warning) setWarning(result.warning);
    return result;
  }

  const photoCount = media.filter((m) => m.mediaType !== "video").length;
  const videoCount = media.length - photoCount;

  return (
    <div className="space-y-6">
      {warning && (
        <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm whitespace-pre-wrap break-all text-amber-800">
          {warning}
        </div>
      )}

      <div className="rounded-lg border bg-white p-4">
        <MultiImageUpload onUploaded={(urls) => addPhotos(albumId, urls)} />
      </div>

      <AddVideoForm albumId={albumId} addVideo={addVideo} />

      <p className="text-sm text-gray-500">
        目前共 {photoCount} 張照片、{videoCount} 支影片。前台會依「排序」數字
        由小到大混合排列。
      </p>

      {media.length === 0 && (
        <p className="text-sm text-gray-500">尚無內容，請上傳照片或新增影片</p>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {media.map((item) => (
          <MediaCard
            key={item.id}
            item={item}
            albumId={albumId}
            updatePhoto={updatePhoto}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

function AddVideoForm({
  albumId,
  addVideo,
}: {
  albumId: string;
  addVideo: (albumId: string, formData: FormData) => Promise<ActionResult>;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [source, setSource] = useState("upload");
  // 送出成功後把整個表單重新掛載，清掉已上傳的影片 URL 與封面圖，
  // 否則連續新增第二支時會沿用前一支的檔案
  const [formKey, setFormKey] = useState(0);

  async function handleSubmit(formData: FormData) {
    const result = await addVideo(albumId, formData);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setError("");
    setSource("upload");
    setFormKey((k) => k + 1);
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md px-4 py-2 text-sm text-white"
        style={{ backgroundColor: "var(--primary-navy)" }}
      >
        + 新增影片
      </button>
    );
  }

  return (
    <form
      key={formKey}
      action={handleSubmit}
      className="space-y-4 rounded-lg border bg-white p-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium">新增影片</h3>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError("");
          }}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          取消
        </button>
      </div>

      <ErrorDisplay error={error} />

      <fieldset>
        <legend className="mb-1 block text-sm font-medium text-gray-700">
          影片來源
        </legend>
        <div className="flex gap-4">
          {[
            { value: "upload", label: "上傳檔案" },
            { value: "youtube", label: "YouTube 連結" },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="source"
                value={opt.value}
                checked={source === opt.value}
                onChange={() => setSource(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/*
        兩組欄位都保持掛載、只用 CSS 隱藏，這樣切換來源不會把已經傳好但還沒
        送出的影片 URL 弄丟。被隱藏的那組仍會送出，由 server action 依 source
        決定採用哪一組。
      */}
      <div className={source === "upload" ? undefined : "hidden"}>
        <VideoUpload name="videoUrl" onUploadingChange={setUploading} />
      </div>
      <div className={source === "youtube" ? undefined : "hidden"}>
        <FormField
          label="YouTube 網址"
          name="youtubeUrl"
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>

      <ImageUpload
        name="posterImage"
        label="封面圖（必填）— 這張圖會顯示在相片牆上"
      />

      <FormField label="影片說明" name="caption" placeholder="選填" />

      {/* 上傳中送出會導致元件卸載，那顆還沒寫進 DB 的影片就變成孤兒了 */}
      <SubmitButton label="新增影片" disabled={uploading} />
      {uploading && (
        <p className="text-xs text-gray-500">影片上傳中，完成後才能新增。</p>
      )}
    </form>
  );
}

function MediaCard({
  item,
  albumId,
  updatePhoto,
  onDelete,
}: {
  item: Media;
  albumId: string;
  updatePhoto: (formData: FormData) => Promise<ActionResult>;
  onDelete: (id: string) => Promise<ActionResult>;
}) {
  const [caption, setCaption] = useState(item.caption || "");
  const [sortOrder, setSortOrder] = useState(item.sortOrder);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const isVideo = item.mediaType === "video";

  function handleSave() {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", item.id);
      formData.set("albumId", albumId);
      formData.set("caption", caption);
      formData.set("sortOrder", String(sortOrder));
      const result = await updatePhoto(formData);
      setError(result?.error || "");
    });
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imageUrl}
          alt={item.caption || (isVideo ? "影片封面" : "照片")}
          className="aspect-square w-full object-cover"
        />
        {isVideo && (
          <span className="absolute left-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
            {item.youtubeId ? "YouTube" : "影片"}
          </span>
        )}
      </div>

      <div className="space-y-2 p-2">
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder={isVideo ? "影片說明" : "圖片說明"}
          className="w-full rounded border px-2 py-1 text-xs"
        />
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500">排序</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="w-16 rounded border px-2 py-1 text-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="rounded border border-blue-300 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 disabled:opacity-50"
          >
            {isPending ? "儲存中..." : "儲存"}
          </button>
          <DeleteButton
            onDelete={() => onDelete(item.id)}
            itemName={isVideo ? "此影片" : "此照片"}
          />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}
