import { useCallback, useEffect, useRef, useState } from "react";
import { maintenanceNotice } from "../data/site-content";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";

const storageKey = "fadd-maintenance-notice-dismissed";

function FirstVisitNotice() {
  const [isVisible, setIsVisible] = useState(false);
  const dismissButtonRef = useRef<HTMLButtonElement | null>(null);

  const dismiss = useCallback(() => {
    window.localStorage.setItem(storageKey, "1");
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (!window.localStorage.getItem(storageKey)) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) {
      return undefined;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      dismissButtonRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dismiss, isVisible]);

  useBodyScrollLock(isVisible);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[85] flex items-center justify-center bg-slate-950/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="maintenance-notice-title"
      aria-describedby="maintenance-notice-description"
      onClick={dismiss}
    >
      <div
        className="section-frame w-full max-w-[26rem] rounded-[1.65rem] p-5 shadow-edge sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="eyebrow">{maintenanceNotice.eyebrow}</span>
        <h2
          id="maintenance-notice-title"
          className="mt-4 max-w-[16ch] text-[1.55rem] font-bold leading-[1.02] tracking-[-0.055em] text-text"
        >
          {maintenanceNotice.title}
        </h2>
        <p
          id="maintenance-notice-description"
          className="mt-4 max-w-[34ch] text-[0.95rem] leading-7 text-muted"
        >
          {maintenanceNotice.description}
        </p>
        <button
          ref={dismissButtonRef}
          type="button"
          className="button-primary mt-6 w-full justify-center"
          onClick={dismiss}
        >
          {maintenanceNotice.cta}
        </button>
      </div>
    </div>
  );
}

export default FirstVisitNotice;
