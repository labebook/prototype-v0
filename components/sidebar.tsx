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
    Layers, Library,
    Settings,
} from "lucide-react"
import { useTeam } from "@/hooks/useTeam"
import { EnhancedTeamSwitcher } from "@/components/enhanced-team-switcher"
import { CreateTeamDialog } from "@/components/create-team-dialog"

export function Sidebar() {
  const pathname = usePathname()
  const [libraryExpanded, setLibraryExpanded] = useState(false)
  const [createTeamOpen, setCreateTeamOpen] = useState(false)
  const { currentTeam } = useTeam()

  const isActive = (href: string) => pathname === href

  return (
    <aside className="w-64 border-r border-gray-200 h-full bg-white flex flex-col">
      {/* Team Switcher */}
      <div className="px-3 pt-4 pb-2">
        <EnhancedTeamSwitcher onCreateTeam={() => setCreateTeamOpen(true)} />
      </div>

      <nav className="py-2 flex-1">
        <ul className="space-y-1">
          {/* Projects - Team scoped */}
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

          {/* Divider */}
          <li className="my-3 border-t border-gray-200"></li>

            <li className="px-4 py-2">
                <div className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <Library className="mr-3 h-5 w-5" />
                    Library
                </div>
            </li>

          {/* Library Section */}
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
                    Pipelines
                </Link>
            </li>
            <li>
              <Link
                href="/methods"
                className={`flex items-center px-4 py-2.5 text-sm ${
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
                href="/custom-modules"
                className={`flex items-center px-4 py-2.5 text-sm ${
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
      </nav>

      {currentTeam && (
        <div className="border-t border-gray-200 p-3">
          <Link
            href="/team/settings"
            className={`flex items-center w-full px-2 py-2 text-sm rounded-md transition-colors ${
              pathname === "/team/settings"
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Settings className="mr-3 h-4 w-4" />
            Team settings
          </Link>
        </div>
      )}

      <CreateTeamDialog
        open={createTeamOpen}
        onOpenChange={setCreateTeamOpen}
      />
    </aside>
  )
}
