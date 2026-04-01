import { Skeleton } from "@/components/ui/skeleton";

function FieldRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-3.5 px-5">
      <div className="flex items-center gap-3">
        <Skeleton className="size-4 rounded" />
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  );
}

export default function CustomerDetailLoading() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back nav */}
      <Skeleton className="h-5 w-36" />

      {/* Hero */}
      <div className="rounded-xl border bg-card p-6 flex items-center gap-5">
        <Skeleton className="size-16 rounded-full shrink-0" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b bg-muted/30">
            <Skeleton className="h-3 w-40" />
          </div>
          <div className="divide-y">
            {Array.from({ length: 4 }).map((_, i) => (
              <FieldRowSkeleton key={i} />
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b bg-muted/30">
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="divide-y">
            {Array.from({ length: 3 }).map((_, i) => (
              <FieldRowSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b bg-muted/30">
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-4">
              <Skeleton className="size-4 rounded shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
