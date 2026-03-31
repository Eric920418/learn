import { getPageSection } from "@/lib/queries/settings";
import { ContactForm } from "./contact-form";

export default async function ContactAdminPage() {
  const welcomeSection = await getPageSection("contact", "welcome");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">聯絡我們</h1>
      <ContactForm welcomeSection={welcomeSection} />
    </div>
  );
}
