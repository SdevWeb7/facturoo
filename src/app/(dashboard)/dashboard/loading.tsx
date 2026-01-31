import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      {/* KPI Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent>
              <div className="flex items-center gap-3">
                <Skeleton className="h-11 w-11 rounded-xl" />
                <div>
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="mt-1 h-7 w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <div className="flex items-center justify-between border-b px-6 py-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="divide-y">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex items-center justify-between px-6 py-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="mt-1 h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-16" />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
