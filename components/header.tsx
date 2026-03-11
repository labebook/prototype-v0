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
    <header
      className={`w-full border-b border-gray-200 transition-colors duration-200 ${
        isWorkspaceMode ? "bg-blue-50" : "bg-white"
      }`}
    >
      <div className="w-full flex justify-between items-center px-6 h-16">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
            PLYOW
          </Link>
        </div>

        {/* Center: Mode Switch Tabs */}
        <nav className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
          {/* Explore Plyow Library Tab */}
          <Link
            href="/"
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              !isWorkspaceMode
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {!isWorkspaceMode && (
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search methods..."
                  className="h-7 w-40 rounded border border-gray-200 bg-gray-50 pl-8 pr-2 text-xs text-gray-900 placeholder:text-gray-400 hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  onClick={(e) => e.preventDefault()}
                />
              </div>
            )}
            Explore Plyow Library
          </Link>

          {/* Research Workspace Tab */}
          <Link
            href="/projects"
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              isWorkspaceMode
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Research Workspace
          </Link>
        </nav>

        {/* Right: User Avatar */}
        <div className="flex-shrink-0">
          <UserDropdown />
        </div>
      </div>
    </header>
  )
}
