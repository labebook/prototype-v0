"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"

export function CustomModuleBreadcrumb() {
  const pathname = usePathname()

  // Extract module slug from pathname
  const segments = pathname.split("/").filter(Boolean)
  const isModuleDetail = segments.length >= 2 && segments[0] === "custom-modules"
  const moduleSlug = isModuleDetail ? segments[1] : null
  const isExamplePage = segments.length >= 3 && segments[2] === "example"

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
    <div className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-3">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
            </li>
            <li>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </li>
            <li>
              <Link href="/custom-modules" className="text-gray-600 hover:text-gray-900">
                Custom Modules
              </Link>
            </li>
            {isModuleDetail && moduleSlug && (
              <>
                <li>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </li>
                <li>
                  {isExamplePage ? (
                    <Link href={`/custom-modules/${moduleSlug}`} className="text-gray-600 hover:text-gray-900">
                      {getModuleName(moduleSlug)}
                    </Link>
                  ) : (
                    <span className="text-gray-900 font-medium">{getModuleName(moduleSlug)}</span>
                  )}
                </li>
                {isExamplePage && (
                  <>
                    <li>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </li>
                    <li>
                      <span className="text-gray-900 font-medium">Protocol</span>
                    </li>
                  </>
                )}
              </>
            )}
          </ol>
        </nav>
      </div>
    </div>
  )
}
