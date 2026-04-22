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
      props.target === "_blank" ||
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      return;
    }

    event.preventDefault();
    await showLoading(loadingDuration);

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
