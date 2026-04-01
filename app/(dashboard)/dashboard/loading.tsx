import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-28" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-md border p-4 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
