import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-muted/60 dark:bg-muted/30 backdrop-blur-md border border-border/50 rounded-full">
      <button
        onClick={() => setTheme("light")}
        className={`p-1.5 rounded-full transition-all duration-200 ${
          theme === "light"
            ? "bg-white text-purple-600 shadow-sm dark:bg-slate-800 dark:text-purple-400"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title="Light Mode"
        aria-label="Light Mode"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-1.5 rounded-full transition-all duration-200 ${
          theme === "dark"
            ? "bg-slate-800 text-purple-400 shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title="Dark Mode"
        aria-label="Dark Mode"
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-1.5 rounded-full transition-all duration-200 ${
          theme === "system"
            ? "bg-white text-purple-600 shadow-sm dark:bg-slate-800 dark:text-purple-400"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title="System Mode"
        aria-label="System Mode"
      >
        <Laptop className="w-4 h-4" />
      </button>
    </div>
  );
}
