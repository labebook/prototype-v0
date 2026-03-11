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

  // Background color based on mode
  const navbarBg = isWorkspaceMode ? "bg-blue-50" : "bg-white"

  return (
    <header
      className={`w-full border-b border-gray-200 transition-colors duration-200 ${navbarBg}`}
    >
      <div className="w-full flex justify-between items-center px-6 h-14">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
            PLYOW
          </Link>
        </div>

        {/* Center: Mode Switch Tabs + Search */}
        <div className="flex items-center gap-4">
          {/* Search Field - always visible */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search methods..."
              className="h-9 w-48 rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Mode Switch Tabs */}
          <nav className="flex items-end">
            {/* Explore Plyow Library Tab */}
            <Link
              href="/"
              className={`min-w-[220px] h-12 flex items-center justify-center text-base font-medium rounded-t-lg transition-all duration-200 ${
                !isWorkspaceMode
                  ? `${navbarBg} text-gray-900 border-t border-l border-r border-gray-200`
                  : "bg-gray-100 text-gray-500 hover:text-gray-900 border-b border-gray-200"
              }`}
            >
              Explore Plyow Library
            </Link>

            {/* Research Workspace Tab */}
            <Link
              href="/projects"
              className={`min-w-[220px] h-12 flex items-center justify-center text-base font-medium rounded-t-lg transition-all duration-200 ${
                isWorkspaceMode
                  ? `${navbarBg} text-gray-900 border-t border-l border-r border-gray-200`
                  : "bg-gray-100 text-gray-500 hover:text-gray-900 border-b border-gray-200"
              }`}
            >
              Research Workspace
            </Link>
          </nav>
        </div>

        {/* Right: User Avatar */}
        <div className="flex-shrink-0">
          <UserDropdown />
        </div>
      </div>
    </header>
  )
}
