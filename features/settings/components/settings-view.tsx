"use client";

import { useTheme } from "next-themes";
import { LucideMoon, LucideSun, LucideMonitor } from "lucide-react";
import { cn } from "@/lib/utils";

const THEMES = [
  { value: "light", label: "Light", icon: LucideSun },
  { value: "dark", label: "Dark", icon: LucideMoon },
  { value: "system", label: "System", icon: LucideMonitor },
] as const;

export function SettingsView() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <div className="space-y-2">
        <h2 className="text-sm font-medium">Appearance</h2>
        <div className="flex gap-3">
          {THEMES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border p-4 text-sm transition-colors w-28",
                theme === value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:border-foreground/30"
              )}
            >
              <Icon className="size-5" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
