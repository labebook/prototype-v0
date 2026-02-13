import type { ReactNode } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WesternBlotSidebar } from "@/components/western-blot-sidebar"
import { WesternBlotTabs } from "@/components/western-blot-tabs"
import { WesternBlotBreadcrumb } from "@/components/western-blot-breadcrumb"

// This is a client component wrapper to handle the conditional rendering
// of tabs based on the current path
function WesternBlotContent({ children }: { children: ReactNode }) {
  "use client"

  const pathname = typeof window !== "undefined" ? window.location.pathname : ""
  const isTheoryPath =
    pathname === "/methods/western-blot/theory" ||
    pathname === "/methods/western-blot/theory/principles" ||
    pathname === "/methods/western-blot/theory/troubleshooting" ||
    pathname === "/methods/western-blot/theory/data-analysis" ||
    pathname === "/methods/western-blot/theory/pipelines" ||
    pathname === "/methods/western-blot/main" ||
    pathname === "/methods/western-blot/basic-principle" ||
    pathname === "/methods/western-blot/variations" ||
    pathname === "/methods/western-blot/results-analysis"

  return (
    <div className="flex-1">
      {/* Only show tabs for Theory-related paths */}
      {isTheoryPath && <WesternBlotTabs />}

      {/* Content Panel - consistent padding regardless of tabs */}
      <div className="py-8">{children}</div>
    </div>
  )
}

export default function WesternBlotLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Breadcrumb Bar */}
      <WesternBlotBreadcrumb />

      {/* Page Title & Subhead */}
      <div className="w-full py-8">
        <div className="mx-auto max-w-[1200px] px-6 text-center">
          <h1 className="text-[32px] font-semibold">Western Blot</h1>
        </div>
      </div>

      {/* Main Layout - fixed width container */}
      <div className="flex-1">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar - fixed width in the grid */}
            <div className="col-span-3">
              <WesternBlotSidebar />
            </div>

            {/* Content Area - takes remaining width */}
            <div className="col-span-9">
              <WesternBlotContent>{children}</WesternBlotContent>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
