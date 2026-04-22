import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type UiLoadingContextValue = {
  isLoading: boolean;
  showLoading: (duration?: number) => Promise<void>;
};

const UiLoadingContext = createContext<UiLoadingContextValue | null>(null);

function UiLoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const showLoading = useCallback((duration = 360) => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    setIsLoading(true);

    return new Promise<void>((resolve) => {
      timeoutRef.current = window.setTimeout(() => {
        setIsLoading(false);
        timeoutRef.current = null;
        resolve();
      }, duration);
    });
  }, []);

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
