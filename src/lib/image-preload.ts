const loadedImages = new Set<string>();

function preloadImage(source: string, timeout = 1200) {
  if (!source || loadedImages.has(source)) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const image = new Image();
    let settled = false;

    const finish = () => {
      if (settled) {
        return;
      }

      settled = true;
      loadedImages.add(source);
      resolve();
    };

    const timeoutId = window.setTimeout(finish, timeout);

    image.onload = () => {
      window.clearTimeout(timeoutId);
      finish();
    };
    image.onerror = () => {
      window.clearTimeout(timeoutId);
      finish();
    };
    image.decoding = "async";
    image.src = source;
  });
}

export function preloadImages(sources: string[], timeout?: number) {
  const uniqueSources = [...new Set(sources.filter(Boolean))];

  if (!uniqueSources.length || typeof window === "undefined") {
    return Promise.resolve();
  }

  return Promise.all(uniqueSources.map((source) => preloadImage(source, timeout))).then(() => undefined);
}
