import * as React from "react"
import { cn } from "@/lib/utils"

function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 px-6 py-16 text-center",
        className
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export { EmptyState }
