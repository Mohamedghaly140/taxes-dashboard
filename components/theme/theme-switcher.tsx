"use client";

import { Button } from "@/components/ui/button";
import { LucideMoon, LucideSun } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <div className="relative w-4 h-4">
        <LucideSun className="absolute w-4 h-4 transition-all dark:-rotate-90 dark:scale-0" />
        <LucideMoon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeSwitcher;
