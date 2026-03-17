import type { ReactNode } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SdsPageSidebar } from "@/components/sds-page-sidebar"
import { SdsPageBreadcrumb } from "@/components/sds-page-breadcrumb"
import { SdsPageContent } from "@/components/sds-page-content"

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
