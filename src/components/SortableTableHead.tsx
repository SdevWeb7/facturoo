"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function SortableTableHead({
  column,
  children,
  className,
}: {
  column: string;
  children: React.ReactNode;
  className?: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentSort = searchParams.get("sort");
  const currentOrder = searchParams.get("order") ?? "desc";
  const isActive = currentSort === column;

  function handleClick() {
    const params = new URLSearchParams(searchParams.toString());
    if (isActive) {
      params.set("order", currentOrder === "asc" ? "desc" : "asc");
    } else {
      params.set("sort", column);
      params.set("order", column === "client" ? "asc" : "desc");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const Icon = isActive
    ? currentOrder === "asc"
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown;

  return (
    <TableHead className={cn("cursor-pointer select-none", className)} onClick={handleClick}>
      <span className="inline-flex items-center gap-1">
        {children}
        <Icon className={cn("size-3.5", isActive ? "text-foreground" : "text-muted-foreground/50")} />
      </span>
    </TableHead>
  );
}
