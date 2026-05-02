import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";

type UiLoadingContextValue = {
  isLoading: boolean;
  beginLoading: () => () => void;
};

const UiLoadingContext = createContext<UiLoadingContextValue | null>(null);

function UiLoadingProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadingTaskCount, setLoadingTaskCount] = useState(0);
  const { copy } = useLanguage();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isLoading = !isAdminRoute && (isInitialLoading || loadingTaskCount > 0);

  useEffect(() => {
    let finishDelayId: number | null = null;

    const finishInitialLoading = () => {
      if (finishDelayId !== null) {
        return;
      }

      finishDelayId = window.setTimeout(() => {
        setIsInitialLoading(false);
      }, 220);
    };

    const safetyId = window.setTimeout(finishInitialLoading, 1100);

    if (document.readyState === "complete") {
      finishInitialLoading();
    } else {
      window.addEventListener("load", finishInitialLoading, { once: true });
    }

    return () => {
      window.clearTimeout(safetyId);

      if (finishDelayId !== null) {
        window.clearTimeout(finishDelayId);
      }

      window.removeEventListener("load", finishInitialLoading);
    };
  }, []);

  const beginLoading = useCallback(() => {
    let isActive = true;

    setLoadingTaskCount((currentCount) => currentCount + 1);

    return () => {
      if (!isActive) {
        return;
      }

      isActive = false;
      setLoadingTaskCount((currentCount) => Math.max(0, currentCount - 1));
    };
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      beginLoading,
    }),
    [beginLoading, isLoading],
  );

  return (
    <UiLoadingContext.Provider value={value}>
      <div className={`transition-opacity duration-300 ease-premium ${!isAdminRoute && isInitialLoading ? "opacity-0" : "opacity-100"}`}>
        {children}
      </div>
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-bg/92 backdrop-blur-[2px] transition-opacity duration-200 ease-premium ${
          isLoading ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isLoading}
        role="status"
        aria-live="polite"
      >
        <div className="surface-panel flex items-center gap-3 rounded-full px-4 py-2.5 shadow-edge">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-lineStrong border-t-accent" />
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.055em] text-text">
            {copy.app.loading}
          </span>
        </div>
      </div>
    </UiLoadingContext.Provider>
  );
}

function useUiLoading() {
  const context = useContext(UiLoadingContext);

  if (!context) {
    throw new Error("useUiLoading must be used within UiLoadingProvider");
  }

  return context;
}

export { UiLoadingProvider, useUiLoading };
