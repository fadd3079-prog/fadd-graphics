import { ArrowUpRight } from "lucide-react";
import ContactForm from "../components/ContactForm";
import SectionHeading from "../components/SectionHeading";
import { useLanguage } from "../hooks/useLanguage";

function ContactSection() {
  const { copy } = useLanguage();

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
            {copy.contact.links.map((contact) => (
              <a
                key={contact.label}
                href={contact.href}
                target={contact.href.startsWith("http") ? "_blank" : undefined}
                rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
                className="section-frame rounded-[1.45rem] p-5 hover:border-lineStrong/80"
              >
                <p className="editorial-note">
                  {contact.label}
                </p>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <p className="text-[1rem] font-semibold tracking-[-0.02em] text-text">{contact.value}</p>
                  <ArrowUpRight className="h-4 w-4 text-muted" />
                </div>
              </a>
            ))}
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}

export default ContactSection;
