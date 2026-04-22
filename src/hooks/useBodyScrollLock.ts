import { useEffect } from "react";

let activeLockCount = 0;
let previousOverflow = "";
let previousPaddingRight = "";
let previousScrollbarGutter = "";

function applyBodyLock() {
  const { body, documentElement } = document;
  const computedPaddingRight = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;
  const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

  previousOverflow = body.style.overflow;
  previousPaddingRight = body.style.paddingRight;
  previousScrollbarGutter = documentElement.style.scrollbarGutter;

  body.style.overflow = "hidden";
  body.style.paddingRight =
    scrollbarWidth > 0 ? `${computedPaddingRight + scrollbarWidth}px` : previousPaddingRight;
  documentElement.style.scrollbarGutter = "stable";
}

function releaseBodyLock() {
  const { body, documentElement } = document;

  body.style.overflow = previousOverflow;
  body.style.paddingRight = previousPaddingRight;
  documentElement.style.scrollbarGutter = previousScrollbarGutter;
}

export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) {
      return undefined;
    }

    if (activeLockCount === 0) {
      applyBodyLock();
    }

    activeLockCount += 1;

    return () => {
      activeLockCount = Math.max(0, activeLockCount - 1);

      if (activeLockCount === 0) {
        releaseBodyLock();
      }
    };
  }, [isLocked]);
}
