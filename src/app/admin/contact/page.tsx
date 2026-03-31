import { getPageSections } from "@/lib/queries/settings";
import { ContactForm } from "./contact-form";

export default async function ContactAdminPage() {
  const sections = await getPageSections("contact");
  const welcomeSection = sections.find(s => s.sectionKey === "welcome") ?? null;
  const contactPersonSection = sections.find(s => s.sectionKey === "contact_person") ?? null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">聯絡我們</h1>
      <ContactForm welcomeSection={welcomeSection} contactPersonSection={contactPersonSection} />
    </div>
  );
}
