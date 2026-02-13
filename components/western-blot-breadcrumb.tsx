"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function WesternBlotBreadcrumb() {
  const pathname = usePathname()

  let activeSection = "Theory"

  if (pathname.includes("/protocol/example")) {
    activeSection = "Protocol Plan › Example"
  } else if (pathname.includes("/protocol")) {
    activeSection = "Protocol Plan"
  } else if (pathname.includes("/data-analysis")) {
    activeSection = "Data Analysis"
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
          <Link href="/methods/western-blot/theory" className="hover:text-gray-900">
            Western Blot
          </Link>
          <span className="mx-2">›</span>
          <span className="font-bold text-gray-900">{activeSection}</span>
        </div>
      </div>
    </div>
  )
}
