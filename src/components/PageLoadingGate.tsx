import { useLayoutEffect } from "react";
import { useUiLoading } from "./UiLoadingProvider";

type PageLoadingGateProps = {
  className?: string;
};

function PageLoadingGate({ className = "section-shell min-h-[60vh] pt-28" }: PageLoadingGateProps) {
  const { beginLoading } = useUiLoading();

  useLayoutEffect(() => {
    const endLoading = beginLoading();

    return endLoading;
  }, [beginLoading]);

  return <section className={className} aria-hidden="true" />;
}

export default PageLoadingGate;
