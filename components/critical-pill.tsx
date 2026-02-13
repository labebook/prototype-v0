"use client"

import type React from "react"

import { AlertTriangle } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface CriticalPillProps {
  content: React.ReactNode
  className?: string
}

export function CriticalPill({ content, className }: CriticalPillProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Critical step"
          className={cn(
            "inline-flex items-center justify-center rounded-full text-sm font-medium",
            "bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] hover:bg-[#FEE2E2]",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-black",
            "ml-2 h-6 w-6 min-w-6",
            className,
          )}
        >
          <AlertTriangle className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 text-sm">{content}</PopoverContent>
    </Popover>
  )
}
