"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  FolderKanban,
  LayoutGrid,
  ChevronDown,
  ChevronRight,
  Flag as Flask,
  FileText,
  Layers,
} from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const [libraryExpanded, setLibraryExpanded] = useState(false)

  const isActive = (href: string) => pathname === href

  return (
    <aside className="w-64 border-r border-gray-200 h-full bg-white">
      <nav className="py-4">
        <ul className="space-y-1">
          {/* Dashboard */}
          <li>
            <Link
              href="/"
              className={`flex items-center px-4 py-2.5 text-sm ${
                isActive("/")
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Home className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
          </li>

          {/* Divider */}
          <li className="my-3 border-t border-gray-200"></li>

          {/* Projects */}
          <li>
            <Link
              href="/projects"
              className={`flex items-center px-4 py-2.5 text-sm ${
                isActive("/projects") || pathname.startsWith("/projects/")
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <FolderKanban className="mr-3 h-5 w-5" />
              Projects
            </Link>
          </li>

          {/* My Pipelines */}
          <li>
            <Link
              href="/pipelines"
              className={`flex items-center px-4 py-2.5 text-sm ${
                isActive("/pipelines") || pathname.startsWith("/pipeline/")
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <LayoutGrid className="mr-3 h-5 w-5" />
              My Pipelines
            </Link>
          </li>

          {/* Divider */}
          <li className="my-3 border-t border-gray-200"></li>

          {/* Library Section (Collapsible) */}
          <li>
            <button
              onClick={() => setLibraryExpanded(!libraryExpanded)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              <span className="flex items-center font-medium">
                {libraryExpanded ? (
                  <ChevronDown className="mr-3 h-5 w-5" />
                ) : (
                  <ChevronRight className="mr-3 h-5 w-5" />
                )}
                Library
              </span>
            </button>

            {/* Library Sub-items */}
            {libraryExpanded && (
              <ul className="mt-1 space-y-1">
                <li>
                  <Link
                    href="/methods"
                    className={`flex items-center pl-12 pr-4 py-2 text-sm ${
                      isActive("/methods") || pathname.startsWith("/methods/")
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Flask className="mr-2 h-4 w-4" />
                    Methods
                  </Link>
                </li>
                <li>
                  <Link
                    href="/protocols"
                    className={`flex items-center pl-12 pr-4 py-2 text-sm ${
                      isActive("/protocols")
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Protocols
                  </Link>
                </li>
                <li>
                  <Link
                    href="/custom-modules"
                    className={`flex items-center pl-12 pr-4 py-2 text-sm ${
                      isActive("/custom-modules") || pathname.startsWith("/custom-modules/")
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Layers className="mr-2 h-4 w-4" />
                    Custom Modules
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  )
}
