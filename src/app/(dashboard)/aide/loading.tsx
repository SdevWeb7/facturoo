import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AideLoading() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-8 w-24" />

      {/* FAQ skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="mt-1 h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="py-4">
                <Skeleton className="h-4 w-full max-w-md" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact form skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-36" />
          <Skeleton className="mt-1 h-4 w-80" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-10 w-40" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
