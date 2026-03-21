import { getPhilosophyItems } from "@/lib/queries/philosophy";
import { PhilosophyForm } from "./philosophy-form";

export default async function PhilosophyAdminPage() {
  const items = await getPhilosophyItems();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">倡導理念</h1>
      <PhilosophyForm items={items} />
    </div>
  );
}
