import { cn } from "@/lib/utils"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}

const bgColors = [
  "bg-primary/15 text-primary",
  "bg-accent/20 text-accent-foreground",
  "bg-success/15 text-success",
  "bg-chart-4/15 text-chart-4",
  "bg-chart-5/15 text-chart-5",
]

function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const initials = getInitials(name || "?")
  const colorIndex = hashString(name || "") % bgColors.length
  const sizeClasses = {
    sm: "size-8 text-xs",
    md: "size-10 text-sm",
    lg: "size-12 text-base",
  }

  return (
    <div
      data-slot="avatar"
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold shrink-0",
        sizeClasses[size],
        bgColors[colorIndex],
        className
      )}
    >
      {initials}
    </div>
  )
}

export { Avatar }
