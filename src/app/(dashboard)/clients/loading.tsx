import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function ClientsLoading() {
  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>

      <Card className="mt-6 overflow-hidden p-0">
        <div className="border-b bg-muted/30 px-4 py-3">
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="ml-auto h-4 w-16" />
          </div>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 border-b px-4 py-3 last:border-0">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-24" />
            <div className="ml-auto flex gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
