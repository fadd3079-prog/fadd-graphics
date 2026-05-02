import { ArrowUpRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import LoadingLink from "./LoadingLink";
import SocialIcon, { type SocialIconName } from "./SocialIcon";
import { useLanguage } from "../hooks/useLanguage";
import logoMarkLight from "../assets/branding/fadd-mark-teal.png";
import logoMarkDark from "../assets/branding/fadd-mark-white-compact.png";

const socialLinks = [
  {
    label: "WhatsApp",
    href: "https://wa.me/6283150964050",
    icon: "whatsapp",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/fadd_graphics",
    icon: "instagram",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mufaddhol-01b60333a/",
    icon: "linkedin",
  },
  {
    label: "Email",
    href: "mailto:faddgraphics@gmail.com",
    icon: "email",
  },
] satisfies { label: string; href: string; icon: SocialIconName }[];

function Footer() {
  const location = useLocation();
  const { copy } = useLanguage();
  const contactHref = location.pathname === "/" ? "#contact" : "/#contact";
  const servicesHref = location.pathname === "/" ? "#services" : "/#services";

  return (
    <footer className="mt-8 border-t border-line/80 bg-surface/90 py-14">
      <div className="section-shell grid gap-8 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <div className="max-w-xl">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-[1rem] border border-line/80 bg-card">
              <img src={logoMarkLight} alt="FADD GRAPHICS" className="h-7 w-7 dark:hidden" />
              <img src={logoMarkDark} alt="FADD GRAPHICS" className="hidden h-7 w-7 dark:block" />
            </span>
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.055em] text-muted">
                FADD GRAPHICS
              </p>
              <p className="text-[0.92rem] leading-6 text-muted">
                {copy.footer.description}
              </p>
            </div>
          </div>

          <p className="mt-6 max-w-lg text-[0.95rem] leading-7 text-muted">
            {copy.footer.note}
          </p>
        </div>

        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.055em] text-muted">
            {copy.footer.quickLinks}
          </p>
          <div className="mt-4 flex flex-col gap-3 text-[0.84rem] font-semibold uppercase tracking-[0.045em]">
            <LoadingLink href="/portfolio" className="inline-flex items-center gap-2 text-text hover:text-accent">
              {copy.footer.portfolio}
              <ArrowUpRight className="h-4 w-4" />
            </LoadingLink>
            <a href={servicesHref} className="inline-flex items-center gap-2 text-text hover:text-accent">
              {copy.footer.services}
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <LoadingLink href={contactHref} className="inline-flex items-center gap-2 text-text hover:text-accent" loadingDuration={280}>
              {copy.footer.brief}
              <ArrowUpRight className="h-4 w-4" />
            </LoadingLink>
          </div>
        </div>

        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.055em] text-muted">
            {copy.footer.connect}
          </p>
          <div className="mt-4 flex items-center gap-3">
            {socialLinks.map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={label}
                className="icon-frame rounded-full bg-card hover:border-accent/55 hover:bg-accentSoft hover:text-accentStrong"
              >
                <SocialIcon name={icon} className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="section-shell mt-10 border-t border-line/80 pt-6 text-[0.9rem] text-muted">
        © {new Date().getFullYear()} {copy.footer.copyright}
      </div>
    </footer>
  );
}

export default Footer;
