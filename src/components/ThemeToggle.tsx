import { Moon, Sun } from "lucide-react";
import type { ThemeMode } from "../hooks/useTheme";

type ThemeToggleProps = {
  theme: ThemeMode;
  onToggle: () => void;
};

function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      className="surface-panel flex h-11 w-11 items-center justify-center rounded-full border border-line/70 bg-card text-text shadow-none hover:border-accent/35 hover:text-accent"
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      title={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
    >
      {isDark ? (
        <Sun className="h-[1.125rem] w-[1.125rem]" />
      ) : (
        <Moon className="h-[1.125rem] w-[1.125rem]" />
      )}
    </button>
  );
}

export default ThemeToggle;
