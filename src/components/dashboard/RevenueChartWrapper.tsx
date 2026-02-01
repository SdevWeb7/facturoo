"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { MonthlyRevenue } from "@/lib/dashboard-data";

const RevenueChart = dynamic(
  () => import("./RevenueChart").then((mod) => mod.RevenueChart),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[300px] w-full rounded-xl" />,
  }
);

interface RevenueChartWrapperProps {
  data: MonthlyRevenue[];
}

export function RevenueChartWrapper({ data }: RevenueChartWrapperProps) {
  return <RevenueChart data={data} />;
}
