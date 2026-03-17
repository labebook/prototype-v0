import type { ReactNode } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WesternBlotSidebar } from "@/components/western-blot-sidebar"
import { WesternBlotBreadcrumb } from "@/components/western-blot-breadcrumb"
import { WesternBlotContent } from "@/components/western-blot-content"

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
