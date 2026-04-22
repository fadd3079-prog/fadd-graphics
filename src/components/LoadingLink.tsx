import { type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUiLoading } from "./UiLoadingProvider";

type LoadingLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  children: ReactNode;
  href: string;
  loadingDuration?: number;
};

function LoadingLink({
  children,
  href,
  loadingDuration = 360,
  onClick,
  ...props
}: LoadingLinkProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { showLoading } = useUiLoading();

  const handleClick = async (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      props.target === "_blank" ||
      props.download !== undefined ||
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      return;
    }

    event.preventDefault();
    const shouldContinue = await showLoading(loadingDuration);

    if (!shouldContinue) {
      return;
    }

    if (href.startsWith("/")) {
      navigate(href);
      return;
    }

    if (href.startsWith("#")) {
      window.history.replaceState(null, "", `${location.pathname}${href}`);
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <a {...props} href={href} onClick={handleClick}>
      {children}
    </a>
  );
}

export default LoadingLink;
