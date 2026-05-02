function withInstantScroll(action: () => void) {
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;

  root.style.scrollBehavior = "auto";
  action();

  window.requestAnimationFrame(() => {
    root.style.scrollBehavior = previousScrollBehavior;
  });
}

export function setManualScrollRestoration() {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
}

export function jumpToTop() {
  withInstantScroll(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  });
}

export function jumpToHash(hash: string) {
  const targetId = hash.replace(/^#/, "");
  const targetElement = targetId ? document.getElementById(targetId) : null;

  if (!targetElement) {
    return false;
  }

  withInstantScroll(() => {
    targetElement.scrollIntoView({ block: "start", behavior: "auto" });
  });

  return true;
}

export function waitForNextPaint() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => resolve());
    });
  });
}

export function waitForHashTarget(hash: string, maxAttempts = 12) {
  return new Promise<void>((resolve) => {
    let attemptCount = 0;

    const tryScroll = () => {
      if (jumpToHash(hash) || attemptCount >= maxAttempts) {
        resolve();
        return;
      }

      attemptCount += 1;
      window.requestAnimationFrame(tryScroll);
    };

    tryScroll();
  });
}
