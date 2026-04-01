import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-24" />
      <div className="rounded-md border p-4 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-9 w-full max-w-sm" />
          </div>
        ))}
        <Skeleton className="h-9 w-24 mt-2" />
      </div>
    </div>
  );
}
