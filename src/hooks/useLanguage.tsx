import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { languageLabels, siteCopy, type Language, type SiteCopy } from "../data/site-content";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  copy: SiteCopy;
  languageLabels: typeof languageLabels;
};

const storageKey = "fadd-language";
const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLanguage(): Language {
  if (typeof window === "undefined") {
    return "id";
  }

  const storedLanguage = window.localStorage.getItem(storageKey);

  return storedLanguage === "en" || storedLanguage === "id" ? storedLanguage : "id";
}

function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    window.localStorage.setItem(storageKey, language);
    document.documentElement.lang = language === "id" ? "id" : "en";
  }, [language]);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      copy: siteCopy[language],
      languageLabels,
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}

export { LanguageProvider, useLanguage };
