"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function SdsPageTabs() {
  const pathname = usePathname()

  // Function to determine if a tab is active based on the pathname
  const isTabActive = (tabPath: string) => {
    if (tabPath === "/methods/sds-page/main" || tabPath === "/methods/sds-page/theory") {
      return pathname === "/methods/sds-page/main" || pathname === "/methods/sds-page/theory"
    }
    return pathname === tabPath
  }

  return (
    <div className="border-b border-gray-200">
      <div className="flex">
        <Link
          href="/methods/sds-page/main"
          className={`px-4 py-3 text-base ${
            isTabActive("/methods/sds-page/main")
              ? "border-b-2 border-black font-bold text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Main
        </Link>
        <Link
          href="/methods/sds-page/basic-principle"
          className={`px-4 py-3 text-base ${
            isTabActive("/methods/sds-page/basic-principle")
              ? "border-b-2 border-black font-bold text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Basic Principle
        </Link>
        <Link
          href="/methods/sds-page/variations"
          className={`px-4 py-3 text-base ${
            isTabActive("/methods/sds-page/variations")
              ? "border-b-2 border-black font-bold text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Variations
        </Link>
        <Link
          href="/methods/sds-page/troubleshooting"
          className={`px-4 py-3 text-base ${
            isTabActive("/methods/sds-page/troubleshooting")
              ? "border-b-2 border-black font-bold text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Troubleshooting
        </Link>
        <Link
          href="/methods/sds-page/results-analysis"
          className={`px-4 py-3 text-base ${
            isTabActive("/methods/sds-page/results-analysis")
              ? "border-b-2 border-black font-bold text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Results & Analysis
        </Link>
      </div>
    </div>
  )
}
