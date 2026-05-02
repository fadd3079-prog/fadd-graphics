import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLanguage } from "../hooks/useLanguage";

type UiLoadingContextValue = {
  isLoading: boolean;
  beginLoading: () => () => void;
  showLoading: (duration?: number) => Promise<boolean>;
};

const UiLoadingContext = createContext<UiLoadingContextValue | null>(null);

function UiLoadingProvider({ children }: { children: ReactNode }) {
  const [isTimedLoading, setIsTimedLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadingTaskCount, setLoadingTaskCount] = useState(0);
  const { copy } = useLanguage();
  const timeoutRef = useRef<number | null>(null);
  const pendingResolveRef = useRef<((shouldContinue: boolean) => void) | null>(null);
  const requestIdRef = useRef(0);
  const isLoading = isInitialLoading || isTimedLoading || loadingTaskCount > 0;

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

  const clearPendingLoading = useCallback((shouldContinue: boolean) => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsTimedLoading(false);
    pendingResolveRef.current?.(shouldContinue);
    pendingResolveRef.current = null;
  }, []);

  const showLoading = useCallback((duration = 360) => {
    requestIdRef.current += 1;
    const requestId = requestIdRef.current;

    clearPendingLoading(false);

    setIsTimedLoading(true);

    return new Promise<boolean>((resolve) => {
      pendingResolveRef.current = resolve;
      timeoutRef.current = window.setTimeout(() => {
        const shouldContinue = requestId === requestIdRef.current;

        if (shouldContinue) {
          setIsTimedLoading(false);
        }

        timeoutRef.current = null;
        pendingResolveRef.current = null;
        resolve(shouldContinue);
      }, duration);
    });
  }, [clearPendingLoading]);

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

  useEffect(() => () => {
    clearPendingLoading(false);
  }, [clearPendingLoading]);

  const value = useMemo(
    () => ({
      isLoading,
      beginLoading,
      showLoading,
    }),
    [beginLoading, isLoading, showLoading],
  );

  return (
    <UiLoadingContext.Provider value={value}>
      <div className={`transition-opacity duration-300 ease-premium ${isInitialLoading ? "opacity-0" : "opacity-100"}`}>
        {children}
      </div>
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-bg transition-opacity duration-300 ease-premium ${
          isInitialLoading ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isInitialLoading}
      >
        <div className="surface-panel flex items-center gap-3 rounded-full px-4 py-2.5 shadow-edge">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-lineStrong border-t-accent" />
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.055em] text-text">
            {copy.app.loading}
          </span>
        </div>
      </div>
      <div
        className={`pointer-events-none fixed inset-x-0 top-24 z-[90] flex justify-center transition duration-300 ${
          isLoading && !isInitialLoading ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
        }`}
        aria-hidden={!isLoading || isInitialLoading}
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
