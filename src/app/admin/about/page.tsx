import { getAims, getDirectors, getPurposes } from "@/lib/queries/about";
import { getPageSections } from "@/lib/queries/settings";
import { AboutForm } from "./about-form";

export default async function AboutAdminPage() {
  const [aims, directors, purposes, sections] = await Promise.all([
    getAims(),
    getDirectors(),
    getPurposes(),
    getPageSections("about"),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">關於本會</h1>
      <AboutForm aims={aims} directors={directors} purposes={purposes} sections={sections} />
    </div>
  );
}
