import { getCategories } from "@/lib/queries/blog";
import { CategoriesForm } from "./categories-form";

export default async function CategoriesPage() {
  const categories = await getCategories();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">分類管理</h1>
      <CategoriesForm categories={categories} />
    </div>
  );
}
