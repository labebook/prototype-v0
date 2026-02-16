"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EnhancedTeamSwitcher } from "@/components/enhanced-team-switcher"
import { TeamManagementModal } from "@/components/team-management-modal"
import { CreateTeamDialog } from "@/components/create-team-dialog"
import { UserDropdown } from "@/components/user-dropdown"

export function Header() {
  const [manageTeamsOpen, setManageTeamsOpen] = useState(false)
  const [createTeamOpen, setCreateTeamOpen] = useState(false)

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="w-full flex justify-between items-center px-6 h-16">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
            PLYOW
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 flex justify-center px-4 max-w-lg">
          <div className="w-full relative">
            <input
              type="text"
              placeholder="Browse Methods..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex-shrink-0 flex items-center space-x-3">
          {/* Quick Action: New Pipeline */}
          <Button
            asChild
            size="sm"
            className="h-9 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            <Link href="/pipelines/new">
              <Plus className="mr-1.5 h-4 w-4" />
              New Pipeline
            </Link>
          </Button>

          {/* Team Switcher */}
          <EnhancedTeamSwitcher
            onManageTeams={() => setManageTeamsOpen(true)}
            onCreateTeam={() => setCreateTeamOpen(true)}
          />

          {/* User Dropdown */}
          <UserDropdown />
        </div>
      </div>

      <TeamManagementModal
        open={manageTeamsOpen}
        onOpenChange={setManageTeamsOpen}
      />

      <CreateTeamDialog
        open={createTeamOpen}
        onOpenChange={setCreateTeamOpen}
      />
    </header>
  )
}
