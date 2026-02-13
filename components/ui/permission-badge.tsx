import { Badge } from "@/components/ui/badge"
import { Lock, LockOpen, Users } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface PermissionBadgeProps {
  canEdit: boolean
  shareCount?: number
  className?: string
  showIcon?: boolean
  showText?: boolean
}

export function PermissionBadge({
  canEdit,
  shareCount,
  className,
  showIcon = true,
  showText = true,
}: PermissionBadgeProps) {
  const Icon = canEdit ? LockOpen : Lock
  const text = canEdit ? "You can edit" : "View only"
  const tooltipText = shareCount
    ? `Shared with ${shareCount} ${shareCount === 1 ? 'person' : 'people'}`
    : text

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={cn(
              "gap-1 text-xs",
              canEdit
                ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
                : "border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400",
              className
            )}
          >
            {showIcon && <Icon className="h-3 w-3" />}
            {showText && <span>{text}</span>}
            {shareCount !== undefined && shareCount > 0 && (
              <>
                <Users className="h-3 w-3 ml-1" />
                <span>{shareCount}</span>
              </>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
