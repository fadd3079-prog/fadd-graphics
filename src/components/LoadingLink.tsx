import { type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useUiLoading } from "./UiLoadingProvider";
import { jumpToTop, waitForHashTarget, waitForNextPaint } from "../lib/navigation-scroll";
import { preparePublicRoute } from "../lib/route-preload";

type LoadingLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  children: ReactNode;
  href: string;
  loadingDuration?: number;
};

function LoadingLink({
  children,
  href,
  loadingDuration = 180,
  onClick,
  ...props
}: LoadingLinkProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { beginLoading } = useUiLoading();

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
    const destination = new URL(href, window.location.href);
    const destinationPath = destination.pathname;
    const destinationHash = destination.hash;
    const targetHref = href.startsWith("#") ? `${location.pathname}${href}` : href;
    const isSamePageHash = Boolean(destinationHash && destinationPath === location.pathname);
    let endLoading: (() => void) | undefined;

    if (isSamePageHash) {
      navigate(targetHref);
      await waitForNextPaint();
      await waitForHashTarget(destinationHash);
      return;
    }

    flushSync(() => {
      endLoading = beginLoading();
    });

    try {
      await Promise.all([
        preparePublicRoute(href),
        new Promise((resolve) => window.setTimeout(resolve, loadingDuration)),
      ]);
    } catch {
      endLoading?.();
      return;
    }

    if (href.startsWith("/") || href.startsWith("#")) {
      navigate(targetHref);
      await waitForNextPaint();

      if (destinationHash) {
        await waitForHashTarget(destinationHash);
      } else if (destinationPath !== location.pathname || href === "/" || href === location.pathname) {
        jumpToTop();
      }

      window.setTimeout(() => endLoading?.(), 120);
      return;
    }
  };

  return (
    <a {...props} href={href} onClick={handleClick}>
      {children}
    </a>
  );
}

export default LoadingLink;
