import { ArrowUpRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import LoadingLink from "./LoadingLink";
import SocialIcon, { type SocialIconName } from "./SocialIcon";
import { useLanguage } from "../hooks/useLanguage";
import { useContactLinks, useResolvedSiteAssets } from "../hooks/useSiteData";

const socialIconMap = {
  whatsapp: "whatsapp",
  instagram: "instagram",
  linkedin: "linkedin",
  email: "email",
  other: "email",
} satisfies Record<string, SocialIconName>;

function Footer() {
  const location = useLocation();
  const { copy, language } = useLanguage();
  const siteAssets = useResolvedSiteAssets();
  const socialLinks = useContactLinks(language);
  const contactHref = location.pathname === "/" ? "#contact" : "/#contact";
  const servicesHref = location.pathname === "/" ? "#services" : "/#services";

  return (
    <footer className="mt-8 border-t border-line/80 bg-surface/90 py-14">
      <div className="section-shell grid gap-8 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <div className="max-w-xl">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-[1rem] border border-line/80 bg-card">
              {siteAssets.footerLogoLight?.url ? (
                <img src={siteAssets.footerLogoLight.url} alt={siteAssets.footerLogoLight.alt_text || "FADD GRAPHICS"} className="h-7 w-7 object-contain dark:hidden" />
              ) : (
                <span className="text-[0.7rem] font-extrabold tracking-[-0.06em] text-text dark:hidden">FG</span>
              )}
              {siteAssets.footerLogoDark?.url ? (
                <img src={siteAssets.footerLogoDark.url} alt={siteAssets.footerLogoDark.alt_text || "FADD GRAPHICS"} className="hidden h-7 w-7 object-contain dark:block" />
              ) : (
                <span className="hidden text-[0.7rem] font-extrabold tracking-[-0.06em] text-text dark:block">FG</span>
              )}
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
            <LoadingLink href={servicesHref} className="inline-flex items-center gap-2 text-text hover:text-accent">
              {copy.footer.services}
              <ArrowUpRight className="h-4 w-4" />
            </LoadingLink>
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
            {socialLinks.map(({ href, label, type }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={label}
                className="icon-frame rounded-full bg-card hover:border-accent/55 hover:bg-accentSoft hover:text-accentStrong"
              >
                <SocialIcon name={socialIconMap[type] ?? "email"} className="h-5 w-5" />
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
