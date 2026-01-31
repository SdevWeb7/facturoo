import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function DevisLoading() {
  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-40" />
      </div>

      <Card className="mt-6 overflow-hidden p-0">
        <div className="border-b bg-muted/30 px-4 py-3">
          <div className="grid grid-cols-6 gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-14" />
            <Skeleton className="ml-auto h-4 w-16" />
          </div>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-6 gap-4 border-b px-4 py-3 last:border-0">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="ml-auto h-8 w-8" />
          </div>
        ))}
      </Card>
    </div>
  );
}
