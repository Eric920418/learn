import { getFocusItems } from "@/lib/queries/recruit";
import { getPageSections } from "@/lib/queries/settings";
import { RecruitForm } from "./recruit-form";

export default async function RecruitAdminPage() {
  const [focusItems, sections] = await Promise.all([
    getFocusItems(),
    getPageSections("recruit"),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">招募會員</h1>
      <RecruitForm focusItems={focusItems} sections={sections} />
    </div>
  );
}
