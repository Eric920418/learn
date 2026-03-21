"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ErrorDisplay } from "@/components/admin/ErrorDisplay";
import { createCategory, deleteCategory } from "@/lib/actions/blog";

interface Category { id: string; name: string; slug: string; }

export function CategoriesForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [error, setError] = useState("");

  return (
    <div>
      <ErrorDisplay error={error} />
      <form action={async (f) => { const r = await createCategory(f); if (r.error) setError(r.error); else router.refresh(); }} className="mb-6 bg-white p-4 rounded-lg border space-y-3">
        <FormField label="名稱" name="name" required />
        <FormField label="Slug" name="slug" required placeholder="category-slug" />
        <SubmitButton label="新增分類" />
      </form>
      <div className="space-y-2">
        {categories.map((c) => (
          <div key={c.id} className="bg-white p-3 rounded-lg border flex items-center justify-between">
            <span>{c.name} <span className="text-gray-400 text-sm">/{c.slug}</span></span>
            <DeleteButton onDelete={() => deleteCategory(c.id)} itemName="此分類" />
          </div>
        ))}
      </div>
    </div>
  );
}
