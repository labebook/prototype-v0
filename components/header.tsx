"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { UserDropdown } from "@/components/user-dropdown"
import { Suspense } from "react"

function HeaderContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Determine active section from URL params or default to methods
  const activeSection = searchParams.get("section") || "methods"

  // Determine if we're in workspace mode
  const isWorkspaceMode =
    pathname.startsWith("/projects") ||
    pathname.startsWith("/team")

  // Check if we're on the home page
  const isHomePage = pathname === "/"

  return (
    <header className="w-full border-b border-gray-200 h-14 flex items-center bg-white">
      {/* Logo */}
      <div className="flex-shrink-0 px-6">
        <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
          PLYOW
        </Link>
      </div>

      {/* Center Section - Search + Methods/Materials links */}
      <div className="flex-1 flex items-center justify-center gap-6">
        {/* Search Field */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search methods..."
            className="h-9 w-64 rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Methods Link */}
        <Link
          href="/?section=methods"
          className={`relative pb-1 text-sm font-medium transition-colors ${
            isHomePage && activeSection === "methods"
              ? "text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Methods
          {isHomePage && activeSection === "methods" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </Link>

        {/* Materials Link */}
        <Link
          href="/?section=materials"
          className={`relative pb-1 text-sm font-medium transition-colors ${
            isHomePage && activeSection === "materials"
              ? "text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Materials
          {isHomePage && activeSection === "materials" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </Link>
      </div>

      {/* Right Section - My Research Workspace + Avatar */}
      <div className="flex items-center gap-4 px-6">
        <Link
          href="/projects"
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            isWorkspaceMode
              ? "bg-gray-900 text-white"
              : "bg-gray-900 text-white hover:bg-gray-800"
          }`}
        >
          My Research Workspace
        </Link>
        <UserDropdown />
      </div>
    </header>
  )
}

export function Header() {
  return (
    <Suspense fallback={
      <header className="w-full border-b border-gray-200 h-14 flex items-center bg-white">
        <div className="flex-shrink-0 px-6">
          <span className="text-2xl font-bold text-gray-900">PLYOW</span>
        </div>
      </header>
    }>
      <HeaderContent />
    </Suspense>
  )
}
