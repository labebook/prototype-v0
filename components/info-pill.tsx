"use client"

import type React from "react"

import { Info } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface InfoPillProps {
  content: React.ReactNode
  className?: string
}

export function InfoPill({ content, className }: InfoPillProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Show note"
          className={cn(
            "inline-flex items-center justify-center rounded-full text-sm font-medium",
            "bg-[#F3F4F6] text-[#374151] border border-[#D1D5DB] hover:bg-[#E5E7EB]",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-black",
            "ml-2 h-6 w-6 min-w-6",
            className,
          )}
        >
          <Info className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 text-sm">{content}</PopoverContent>
    </Popover>
  )
}
