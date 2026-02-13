import type { ReactNode } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SdsPageSidebar } from "@/components/sds-page-sidebar"
import { SdsPageTabs } from "@/components/sds-page-tabs"
import { SdsPageBreadcrumb } from "@/components/sds-page-breadcrumb"

// This is a client component wrapper to handle the conditional rendering
// of tabs based on the current path
function SdsPageContent({ children }: { children: ReactNode }) {
  "use client"

  const pathname = typeof window !== "undefined" ? window.location.pathname : ""
  const isTheoryPath =
    pathname === "/methods/sds-page/theory" ||
    pathname === "/methods/sds-page/main" ||
    pathname === "/methods/sds-page/basic-principle" ||
    pathname === "/methods/sds-page/variations" ||
    pathname === "/methods/sds-page/troubleshooting" ||
    pathname === "/methods/sds-page/results-analysis"

  return (
    <div className="flex-1">
      {/* Only show tabs for Theory-related paths */}
      {isTheoryPath && <SdsPageTabs />}

      {/* Content Panel - consistent padding regardless of tabs */}
      <div className="py-8">{children}</div>
    </div>
  )
}

export default function SdsPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Breadcrumb Bar */}
      <SdsPageBreadcrumb />

      {/* Page Title & Subhead */}
      <div className="w-full py-8">
        <div className="mx-auto max-w-[1200px] px-6 text-center">
          <h1 className="text-[32px] font-semibold">SDS-PAGE</h1>
        </div>
      </div>

      {/* Main Layout - fixed width container */}
      <div className="flex-1">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar - fixed width in the grid */}
            <div className="col-span-3">
              <SdsPageSidebar />
            </div>

            {/* Content Area - takes remaining width */}
            <div className="col-span-9">
              <SdsPageContent>{children}</SdsPageContent>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
