"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideLayoutDashboard, LucideUsers, LucideSettings, LucideUser, LucideLogOut } from "lucide-react";
import { useTransition } from "react";
import { logout } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { User as LuciaUser } from "lucia";

const navItems = [
  { href: "/dashboard",           label: "Overview",   icon: LucideLayoutDashboard },
  { href: "/dashboard/customers", label: "Customers",  icon: LucideUsers },
  { href: "/dashboard/settings",  label: "Settings",   icon: LucideSettings },
  { href: "/dashboard/profile",   label: "Profile",    icon: LucideUser },
];

export function Sidebar({ user }: { user: LuciaUser }) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(() => logout());
  }

  return (
    <aside className="flex flex-col w-56 border-r bg-card px-3 py-4">
      <div className="px-2 mb-6">
        <h2 className="text-lg font-semibold">Taxes Dashboard</h2>
        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors",
              pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"))
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <Button
        variant="ghost"
        className="justify-start gap-3 text-muted-foreground"
        onClick={handleLogout}
        disabled={isPending}
      >
        <LucideLogOut className="size-4 shrink-0" />
        {isPending ? "Signing out…" : "Sign out"}
      </Button>
    </aside>
  );
}
