import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";

const storageKey = "fadd-theme";

function getPreferredTheme(): ThemeMode {
  const storedTheme = window.localStorage.getItem(storageKey);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() =>
    document.documentElement.classList.contains("dark")
      ? "dark"
      : getPreferredTheme(),
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(storageKey, theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      const storedTheme = window.localStorage.getItem(storageKey);

      if (!storedTheme) {
        setTheme(mediaQuery.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return {
    theme,
    toggleTheme: () =>
      setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light")),
  };
}
