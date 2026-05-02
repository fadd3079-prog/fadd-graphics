import { useLayoutEffect, useMemo, useState } from "react";
import { preloadImages } from "../lib/image-preload";
import { useUiLoading } from "../components/UiLoadingProvider";

type CriticalImagesOptions = {
  enabled?: boolean;
  timeout?: number;
  minimumDuration?: number;
};

export function useCriticalImages(
  sources: string[],
  {
    enabled = true,
    timeout = 1200,
    minimumDuration = 140,
  }: CriticalImagesOptions = {},
) {
  const { beginLoading } = useUiLoading();
  const imageKey = useMemo(() => [...new Set(sources.filter(Boolean))].join("|"), [sources]);
  const [isReady, setIsReady] = useState(!enabled || !imageKey);

  useLayoutEffect(() => {
    if (!enabled || !imageKey) {
      setIsReady(true);
      return undefined;
    }

    let isCancelled = false;
    const criticalSources = imageKey.split("|").filter(Boolean);
    const startTime = performance.now();
    const endLoading = beginLoading();

    setIsReady(false);

    preloadImages(criticalSources, timeout).finally(() => {
      const remainingDuration = Math.max(0, minimumDuration - (performance.now() - startTime));

      window.setTimeout(() => {
        if (!isCancelled) {
          setIsReady(true);
        }

        endLoading();
      }, remainingDuration);
    });

    return () => {
      isCancelled = true;
      endLoading();
    };
  }, [beginLoading, enabled, imageKey, minimumDuration, timeout]);

  return isReady;
}
