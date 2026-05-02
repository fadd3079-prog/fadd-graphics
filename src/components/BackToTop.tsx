import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { copy } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 520);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label={copy.app.backToTop}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="surface-panel fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-card hover:border-accent/35 hover:text-accent"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}

export default BackToTop;
