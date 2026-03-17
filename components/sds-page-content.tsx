"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { SdsPageTabs } from "@/components/sds-page-tabs"

export function SdsPageContent({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isTheoryPath =
    pathname === "/methods/sds-page/theory" ||
    pathname === "/methods/sds-page/main" ||
    pathname === "/methods/sds-page/basic-principle" ||
    pathname === "/methods/sds-page/variations" ||
    pathname === "/methods/sds-page/troubleshooting" ||
    pathname === "/methods/sds-page/results-analysis"

  return (
    <div className="flex-1">
      {isTheoryPath && <SdsPageTabs />}
      <div className="py-8">{children}</div>
    </div>
  )
}
