import type { ReactNode } from "react"

interface PillProps {
  children: ReactNode
}

export function Pill({ children }: PillProps) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F3F4F6] text-[#374151] border border-[#D1D5DB] my-2">
      {children}
    </span>
  )
}
