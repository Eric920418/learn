import { getPageSection } from "@/lib/queries/settings";
import { getContactPersons } from "@/lib/queries/contact";
import { ContactForm } from "./contact-form";

export default async function ContactAdminPage() {
  const [welcomeSection, contactPersons] = await Promise.all([
    getPageSection("contact", "welcome"),
    getContactPersons(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">聯絡我們</h1>
      <ContactForm welcomeSection={welcomeSection} contactPersons={contactPersons} />
    </div>
  );
}
