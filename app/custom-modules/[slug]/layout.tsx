import type { ReactNode } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CustomModuleSidebar } from "@/components/custom-module-sidebar"
import { CustomModuleBreadcrumb } from "@/components/custom-module-breadcrumb"
import { CustomModuleTheoryTabs } from "@/components/custom-module-theory-tabs"

function CustomModuleContent({ children, slug }: { children: ReactNode; slug: string }) {
  "use client"

  const pathname = typeof window !== "undefined" ? window.location.pathname : ""
  const isTheoryPath = pathname.includes("/theory")

  return (
    <div className="flex-1">
      {/* Only show tabs for Theory-related paths */}
      {isTheoryPath && <CustomModuleTheoryTabs moduleSlug={slug} />}

      {/* Content Panel - consistent padding regardless of tabs */}
      <div className="py-8">{children}</div>
    </div>
  )
}

export default function CustomModuleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: { slug: string }
}) {
  // Convert slug to readable name
  const getModuleName = (slug: string) => {
    if (slug === "whole-cell-lysate-preparation-suspension-cells") {
      return "Whole-Cell Protein Lysate Preparation Using Detergent-Based Buffer"
    }
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Breadcrumb Bar */}
      <CustomModuleBreadcrumb />

      {/* Main Layout - fixed width container */}
      <div className="flex-1">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar - fixed width in the grid */}
            <div className="col-span-3">
              <CustomModuleSidebar moduleSlug={params.slug} />
            </div>

            {/* Content Area - takes remaining width */}
            <div className="col-span-9">
              <CustomModuleContent slug={params.slug}>{children}</CustomModuleContent>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
