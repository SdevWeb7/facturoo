import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SettingsLoading() {
  return (
    <div className="animate-fade-in-up space-y-8">
      <Skeleton className="h-8 w-36" />

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-11 w-full" />
            </div>
          ))}
          <Skeleton className="h-10 w-40" />
        </CardContent>
      </Card>

      {/* Subscription Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border p-5">
            <div className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="mt-2 h-4 w-48" />
              </div>
            </div>
          </div>
          <Skeleton className="mt-4 h-10 w-48" />
        </CardContent>
      </Card>
    </div>
  );
}
