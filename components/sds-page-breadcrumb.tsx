"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function SdsPageBreadcrumb() {
  const pathname = usePathname()

  // Determine the active section based on the pathname
  let activeSection = "Theory"
  let exampleProtocol = false

  if (pathname.includes("/protocol/example")) {
    activeSection = "Protocol"
    exampleProtocol = true
  } else if (pathname.includes("/protocol")) {
    activeSection = "Protocol"
  } else if (pathname.includes("/data-analysis")) {
    activeSection = "Data Analysis"
  } else if (pathname.includes("/materials")) {
    activeSection = "Materials"
  }

  return (
    <div className="w-full border-b border-gray-200 py-2">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2">›</span>
          <Link href="/plyowsearchresults" className="hover:text-gray-900">
            Search Results
          </Link>
          <span className="mx-2">›</span>
          <Link href="/methods/sds-page/theory" className="hover:text-gray-900">
            SDS-PAGE
          </Link>
          <span className="mx-2">›</span>
          <Link href="/methods/sds-page/protocol" className="hover:text-gray-900">
            {activeSection}
          </Link>
          {exampleProtocol && (
            <>
              <span className="mx-2">›</span>
              <span className="font-bold text-gray-900">Example</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
