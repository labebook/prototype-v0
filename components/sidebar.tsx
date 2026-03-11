"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    FolderKanban,
    LayoutGrid,
    Library,
    Settings,
} from "lucide-react"
import { useTeam } from "@/hooks/useTeam"
import { EnhancedTeamSwitcher } from "@/components/enhanced-team-switcher"
import { CreateTeamDialog } from "@/components/create-team-dialog"

// Custom unified icons for LIBRARY section
// All icons use a square container with thin outline and a geometric symbol inside

const IconMethods = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25">
    <rect x="2" y="2" width="12" height="12" rx="1" />
    <rect x="5" y="5" width="6" height="6" />
  </svg>
)

const IconOperationalProcedures = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25">
    <rect x="2" y="2" width="12" height="12" rx="1" />
    <rect x="8" y="4.5" width="5" height="5" transform="rotate(45 8 7)" />
  </svg>
)

const IconPreparations = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25">
    <rect x="2" y="2" width="12" height="12" rx="1" />
    <path d="M8 4.5L11.5 10.5H4.5L8 4.5Z" />
  </svg>
)

const IconExperimentalModels = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25">
    <rect x="2" y="2" width="12" height="12" rx="1" />
    <circle cx="8" cy="8" r="3" />
  </svg>
)

export function Sidebar() {
  const pathname = usePathname()
  const [libraryExpanded, setLibraryExpanded] = useState(false)
  const [createTeamOpen, setCreateTeamOpen] = useState(false)
  const { currentTeam } = useTeam()

  const isActive = (href: string) => pathname === href

  // Determine if we're in workspace mode
  const isWorkspaceMode =
    pathname.startsWith("/projects") ||
    pathname.startsWith("/team")

  return (
    <aside
      className={`w-64 border-r border-gray-200 h-full flex flex-col transition-colors duration-200 ${
        isWorkspaceMode ? "bg-gray-100" : "bg-white"
      }`}
    >
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
                        isActive("/pipelines") || pathname.startsWith("/pipeline/") || pathname.startsWith("/pipelines/")
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
                <IconMethods className="mr-2 h-4 w-4" />
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
                <IconOperationalProcedures className="mr-2 h-4 w-4" />
                Operational Procedures
              </Link>
            </li>
            <li>
              <Link
                href="/preparations"
                className={`flex items-center px-4 py-2.5 text-sm ${
                  isActive("/preparations") || pathname.startsWith("/preparations/")
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <IconPreparations className="mr-2 h-4 w-4" />
                Preparations
              </Link>
            </li>
            <li>
              <Link
                href="/experimental-models"
                className={`flex items-center px-4 py-2.5 text-sm ${
                  isActive("/experimental-models") || pathname.startsWith("/experimental-models/")
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <IconExperimentalModels className="mr-2 h-4 w-4" />
                Experimental Models
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
