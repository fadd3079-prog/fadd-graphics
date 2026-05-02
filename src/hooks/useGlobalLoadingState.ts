import { useEffect } from "react";
import { useUiLoading } from "../components/UiLoadingProvider";

export function useGlobalLoadingState(isActive: boolean) {
  const { beginLoading } = useUiLoading();

  useEffect(() => {
    if (!isActive) {
      return undefined;
    }

    const endLoading = beginLoading();

    return endLoading;
  }, [beginLoading, isActive]);
}
