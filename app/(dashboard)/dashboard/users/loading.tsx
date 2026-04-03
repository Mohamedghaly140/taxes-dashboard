import { Skeleton } from "@/components/ui/skeleton";

const COLUMNS = 7;
const ROWS = 5;

export default function UsersLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-20" />

      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-9 w-28" />
      </div>

      <div className="rounded-md border">
        <div className="border-b px-4 py-3 flex gap-4">
          {Array.from({ length: COLUMNS }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
        {Array.from({ length: ROWS }).map((_, i) => (
          <div key={i} className="flex gap-4 px-4 py-3 border-b last:border-0">
            {Array.from({ length: COLUMNS }).map((_, j) => (
              <Skeleton key={j} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
