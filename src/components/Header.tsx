import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import LoadingLink from "./LoadingLink";
import ThemeToggle from "./ThemeToggle";
import type { ThemeMode } from "../hooks/useTheme";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";
import { useLanguage } from "../hooks/useLanguage";
import type { Language } from "../data/site-content";
import logoMarkLight from "../assets/branding/fadd-mark-teal.png";
import logoMarkDark from "../assets/branding/fadd-mark-white-compact.png";

type HeaderProps = {
  theme: ThemeMode;
  onToggleTheme: () => void;
};

function Header({ theme, onToggleTheme }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { copy, language, languageLabels, setLanguage } = useLanguage();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const languages: Language[] = ["id", "en"];

  useBodyScrollLock(isMenuOpen);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shellClassName = isScrolled
    ? "border-line bg-bg shadow-edge"
    : "border-line bg-bg shadow-soft";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3">
      <div
        className={`mx-auto max-w-[1280px] rounded-[1.45rem] border transition-all duration-500 ease-premium ${shellClassName}`}
      >
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[1rem] border border-line/80 bg-card">
              <img src={logoMarkLight} alt="FADD GRAPHICS" className="h-7 w-7 dark:hidden" />
              <img src={logoMarkDark} alt="FADD GRAPHICS" className="hidden h-7 w-7 dark:block" />
            </span>
            <span className="hidden sm:block">
              <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.055em] text-muted">
                {copy.header.tagline}
              </span>
              <span className="block text-[0.92rem] font-bold tracking-[-0.03em] text-text">
                FADD GRAPHICS
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1.5 lg:flex">
            {copy.navItems.map((item) => (
              item.kind === "page" ? (
                <LoadingLink
                  key={item.label}
                  href={item.target}
                  className={`rounded-full px-3.5 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.045em] ${
                    location.pathname === item.target ? "bg-card text-text" : "text-muted hover:bg-card hover:text-text"
                  }`}
                >
                  {item.label}
                </LoadingLink>
              ) : (
                <a
                  key={item.label}
                  href={isHomePage ? `#${item.target}` : `/#${item.target}`}
                  className="rounded-full px-3.5 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.045em] text-muted hover:bg-card hover:text-text"
                >
                  {item.label}
                </a>
              )
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div
              className="hidden rounded-full border border-line bg-card p-1 sm:flex"
              aria-label={copy.header.languageLabel}
            >
              {languages.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.055em] ${
                    language === item ? "bg-text text-bg" : "text-muted hover:text-text"
                  }`}
                  onClick={() => setLanguage(item)}
                >
                  {languageLabels[item]}
                </button>
              ))}
            </div>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />

            <a href={isHomePage ? "#contact" : "/#contact"} className="button-primary hidden sm:inline-flex">
              {copy.header.cta}
              <ArrowUpRight className="h-4 w-4" />
            </a>

            <button
              type="button"
              className="surface-panel flex h-11 w-11 items-center justify-center rounded-full bg-card lg:hidden"
              aria-label={isMenuOpen ? copy.header.closeMenu : copy.header.openMenu}
              onClick={() => setIsMenuOpen((currentState) => !currentState)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen ? (
          <div className="border-t border-line/80 px-4 pb-4 pt-3 lg:hidden">
            <nav className="flex flex-col gap-2">
              <div className="mb-1 flex rounded-full border border-line bg-card p-1">
                {languages.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`flex-1 rounded-full px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.055em] ${
                      language === item ? "bg-text text-bg" : "text-muted"
                    }`}
                    onClick={() => setLanguage(item)}
                  >
                    {languageLabels[item]}
                  </button>
                ))}
              </div>
              {copy.navItems.map((item) => (
                item.kind === "page" ? (
                  <LoadingLink
                    key={item.label}
                    href={item.target}
                    className="rounded-[1.1rem] border border-line/60 bg-card px-4 py-3 text-[0.82rem] font-semibold uppercase tracking-[0.045em] text-text hover:border-lineStrong/80"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </LoadingLink>
                ) : (
                  <a
                    key={item.label}
                    href={isHomePage ? `#${item.target}` : `/#${item.target}`}
                    className="rounded-[1.1rem] border border-line/60 bg-card px-4 py-3 text-[0.82rem] font-semibold uppercase tracking-[0.045em] text-text hover:border-lineStrong/80"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                )
              ))}
              <a href={isHomePage ? "#contact" : "/#contact"} className="button-primary mt-2 justify-center" onClick={() => setIsMenuOpen(false)}>
                {copy.header.cta}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default Header;
