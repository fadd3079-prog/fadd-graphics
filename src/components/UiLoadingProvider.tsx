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

type UiLoadingContextValue = {
  isLoading: boolean;
  showLoading: (duration?: number) => Promise<boolean>;
};

const UiLoadingContext = createContext<UiLoadingContextValue | null>(null);

function UiLoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const pendingResolveRef = useRef<((shouldContinue: boolean) => void) | null>(null);
  const requestIdRef = useRef(0);

  const clearPendingLoading = useCallback((shouldContinue: boolean) => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    pendingResolveRef.current?.(shouldContinue);
    pendingResolveRef.current = null;
  }, []);

  const showLoading = useCallback((duration = 360) => {
    requestIdRef.current += 1;
    const requestId = requestIdRef.current;

    clearPendingLoading(false);

    setIsLoading(true);

    return new Promise<boolean>((resolve) => {
      pendingResolveRef.current = resolve;
      timeoutRef.current = window.setTimeout(() => {
        const shouldContinue = requestId === requestIdRef.current;

        if (shouldContinue) {
          setIsLoading(false);
        }

        timeoutRef.current = null;
        pendingResolveRef.current = null;
        resolve(shouldContinue);
      }, duration);
    });
  }, [clearPendingLoading]);

  useEffect(() => () => {
    clearPendingLoading(false);
  }, [clearPendingLoading]);

  const value = useMemo(
    () => ({
      isLoading,
      showLoading,
    }),
    [isLoading, showLoading],
  );

  return (
    <UiLoadingContext.Provider value={value}>
      {children}
      <div
        className={`pointer-events-none fixed inset-x-0 top-24 z-[90] flex justify-center transition duration-300 ${
          isLoading ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
        }`}
        aria-hidden={!isLoading}
      >
        <div className="surface-panel flex items-center gap-3 rounded-full px-4 py-2.5 shadow-edge">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-lineStrong border-t-accent" />
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-text">
            Memuat
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
