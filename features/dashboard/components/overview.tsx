import { getDashboardStats } from "../actions";
import {
  LucideCalendar,
  LucideClock,
  LucideUserPlus,
  LucideUsers,
} from "lucide-react";

export async function DashboardOverview() {
  const { total, newThisMonth, newThisWeek, latest } = await getDashboardStats();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-md border p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LucideUsers className="size-4" />
            Total Customers
          </div>
          <p className="text-3xl font-bold">{total}</p>
        </div>

        <div className="rounded-md border p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LucideCalendar className="size-4" />
            New This Month
          </div>
          <p className="text-3xl font-bold">{newThisMonth}</p>
        </div>

        <div className="rounded-md border p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LucideUserPlus className="size-4" />
            New This Week
          </div>
          <p className="text-3xl font-bold">{newThisWeek}</p>
        </div>

        <div className="rounded-md border p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LucideClock className="size-4" />
            Latest Customer
          </div>
          {latest ? (
            <>
              <p className="font-medium truncate">{latest.name}</p>
              <p className="text-xs text-muted-foreground">
                {latest.createdAt.toLocaleDateString()}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">None yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
