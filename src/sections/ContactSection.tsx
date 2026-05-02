import { ArrowUpRight } from "lucide-react";
import ContactForm from "../components/ContactForm";
import SectionHeading from "../components/SectionHeading";
import SocialIcon, { type SocialIconName } from "../components/SocialIcon";
import { useLanguage } from "../hooks/useLanguage";
import { useContactLinks } from "../hooks/useSiteData";

const contactIcons = {
  whatsapp: "whatsapp",
  email: "email",
  instagram: "instagram",
  linkedin: "linkedin",
  other: "email",
} satisfies Record<string, SocialIconName>;

function ContactSection() {
  const { copy, language } = useLanguage();
  const contactLinks = useContactLinks(language);

  return (
    <section id="contact" className="section-shell section-space pb-16 sm:pb-20">
      <div className="grid gap-10 xl:grid-cols-[0.84fr_1.16fr]">
        <div className="space-y-8">
          <SectionHeading
            eyebrow={copy.contact.eyebrow}
            title={copy.contact.title}
            description={copy.contact.description}
          />

          <div className="grid gap-4">
            {contactLinks.map((contact) => {
              const icon = contactIcons[contact.type] ?? "email";

              return (
                <a
                  key={contact.label}
                  href={contact.href}
                  target={contact.href.startsWith("http") ? "_blank" : undefined}
                  rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
                  className="section-frame rounded-[1.45rem] p-5 hover:border-lineStrong/80"
                >
                  <div className="flex items-center gap-3">
                    <span className="icon-frame">
                      <SocialIcon name={icon} className="h-5 w-5" />
                    </span>
                    <p className="editorial-note">
                      {contact.label}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <p className="text-[1rem] font-semibold tracking-[-0.02em] text-text">{contact.value}</p>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}

export default ContactSection;
