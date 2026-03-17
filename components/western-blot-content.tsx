"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { WesternBlotTabs } from "@/components/western-blot-tabs"

export function WesternBlotContent({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isTheoryPath =
    pathname === "/methods/western-blot/theory" ||
    pathname.startsWith("/methods/western-blot/theory/")

  return (
    <div className="flex-1">
      {isTheoryPath && <WesternBlotTabs />}
      <div className="py-8">{children}</div>
    </div>
  )
}
