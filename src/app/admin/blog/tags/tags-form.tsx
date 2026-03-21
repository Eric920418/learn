"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ErrorDisplay } from "@/components/admin/ErrorDisplay";
import { createTag, deleteTag } from "@/lib/actions/blog";

interface Tag { id: string; name: string; slug: string; }

export function TagsForm({ tags }: { tags: Tag[] }) {
  const router = useRouter();
  const [error, setError] = useState("");

  return (
    <div>
      <ErrorDisplay error={error} />
      <form action={async (f) => { const r = await createTag(f); if (r.error) setError(r.error); else router.refresh(); }} className="mb-6 bg-white p-4 rounded-lg border space-y-3">
        <FormField label="名稱" name="name" required />
        <FormField label="Slug" name="slug" required placeholder="tag-slug" />
        <SubmitButton label="新增標籤" />
      </form>
      <div className="space-y-2">
        {tags.map((t) => (
          <div key={t.id} className="bg-white p-3 rounded-lg border flex items-center justify-between">
            <span>{t.name} <span className="text-gray-400 text-sm">/{t.slug}</span></span>
            <DeleteButton onDelete={() => deleteTag(t.id)} itemName="此標籤" />
          </div>
        ))}
      </div>
    </div>
  );
}
