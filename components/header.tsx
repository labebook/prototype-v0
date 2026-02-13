"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EnhancedTeamSwitcher } from "@/components/enhanced-team-switcher"
import { TeamManagementModal } from "@/components/team-management-modal"
import { CreateTeamDialog } from "@/components/create-team-dialog"
import { useTeam } from "@/hooks/useTeam"

export function Header() {
  const { currentUser } = useTeam()
  const [manageTeamsOpen, setManageTeamsOpen] = useState(false)
  const [createTeamOpen, setCreateTeamOpen] = useState(false)
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="w-full flex justify-between items-center px-6 h-16">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="text-2xl font-bold">
            PLYOW
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 flex justify-center px-4 max-w-md">
          <div className="w-full relative">
            <input
              type="text"
              placeholder="Search methods, pipelines, protocols..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex-shrink-0 flex items-center space-x-4">
          <Button asChild className="h-12 bg-black hover:bg-gray-800 text-white font-normal">
            <Link href="/pipelines">Go to Pipelines</Link>
          </Button>

          <EnhancedTeamSwitcher
            onManageTeams={() => setManageTeamsOpen(true)}
            onCreateTeam={() => setCreateTeamOpen(true)}
          />

          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="sr-only">User avatar</span>
            </div>
            <span>{currentUser.name}</span>
            <ChevronDown className="h-4 w-4" />
          </div>
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
