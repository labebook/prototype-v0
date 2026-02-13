import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface RoleBadgeProps {
  role: 'PI' | 'Collaborator'
  className?: string
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "text-xs font-medium",
        role === 'PI'
          ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
          : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
        className
      )}
    >
      {role}
    </Badge>
  )
}
