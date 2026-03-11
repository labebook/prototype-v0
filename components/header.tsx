"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"
import { UserDropdown } from "@/components/user-dropdown"

export function Header() {
  const pathname = usePathname()

  // Determine active mode based on current path
  const isWorkspaceMode =
    pathname.startsWith("/projects") ||
    pathname.startsWith("/team")

  return (
    <header className="w-full border-b border-gray-200 h-14 flex">
      {/* Left: Logo */}
      <div className="flex-shrink-0 flex items-center px-6 bg-white">
        <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
          PLYOW
        </Link>
      </div>

      {/* Segmented Navigation - fills remaining space */}
      <div className="flex-1 flex">
        {/* Explore Plyow Library Segment */}
        <Link
          href="/"
          className={`flex-1 flex items-center justify-center gap-3 text-base font-medium transition-colors duration-200 ${
            !isWorkspaceMode
              ? "bg-white text-gray-900"
              : "bg-gray-100 text-gray-500 hover:text-gray-700"
          }`}
        >
          {/* Search Field */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search methods..."
              className="h-8 w-44 rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          Explore Plyow Library
        </Link>

        {/* Vertical Divider */}
        <div className="w-px bg-gray-200" />

        {/* Research Workspace Segment */}
        <Link
          href="/projects"
          className={`flex-1 flex items-center justify-center text-base font-medium transition-colors duration-200 ${
            isWorkspaceMode
              ? "bg-white text-gray-900"
              : "bg-gray-100 text-gray-500 hover:text-gray-700"
          }`}
        >
          Research Workspace
        </Link>
      </div>

      {/* Right: User Avatar */}
      <div className="flex-shrink-0 flex items-center px-6 bg-white">
        <UserDropdown />
      </div>
    </header>
  )
}
