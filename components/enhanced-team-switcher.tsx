"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Plus, Settings, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { RoleBadge } from "@/components/ui/role-badge"
import { useTeam } from "@/hooks/useTeam"
import { getUserTeams } from "@/lib/mockData"
import { cn } from "@/lib/utils"

interface EnhancedTeamSwitcherProps {
  onManageTeams?: () => void
  onCreateTeam?: () => void
}

export function EnhancedTeamSwitcher({
  onManageTeams,
  onCreateTeam,
}: EnhancedTeamSwitcherProps) {
  const {
    currentUser,
    currentTeam,
    switchTeam,
    pendingInvitations,
    acceptInvitation,
    declineInvitation,
  } = useTeam()

  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const userTeams = getUserTeams(currentUser.id)

  // Filter teams by search query
  const filteredTeams = userTeams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSwitchTeam = (teamId: string) => {
    switchTeam(teamId)
    setOpen(false)
  }

  const handleAcceptInvitation = (invitationId: string) => {
    acceptInvitation(invitationId)
  }

  const handleDeclineInvitation = (invitationId: string) => {
    declineInvitation(invitationId)
  }

  const getTeamInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getUserRole = (teamId: string) => {
    const team = userTeams.find(t => t.id === teamId)
    const member = team?.members.find(m => m.userId === currentUser.id)
    return member?.role || 'Collaborator'
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-xs">
                {currentTeam ? getTeamInitials(currentTeam.name) : '?'}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">
              {currentTeam?.name || 'Select team'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {pendingInvitations.length > 0 && (
              <span className="flex h-2 w-2 rounded-full bg-red-500" />
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] p-0 bg-white border-gray-200">
        <div className="p-2 bg-white">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search teams..."
              className="pl-8 bg-white border-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <DropdownMenuSeparator />

        <div className="max-h-[300px] overflow-y-auto bg-white">
          <DropdownMenuLabel className="text-gray-600">Your Teams</DropdownMenuLabel>
          {filteredTeams.length === 0 ? (
            <div className="px-2 py-6 text-center text-sm text-gray-500">
              No teams found
            </div>
          ) : (
            filteredTeams.map((team) => {
              const role = getUserRole(team.id)
              const isSelected = currentTeam?.id === team.id

              return (
                <DropdownMenuItem
                  key={team.id}
                  onSelect={() => handleSwitchTeam(team.id)}
                  className="flex items-center gap-2 px-2 py-2"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {getTeamInitials(team.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{team.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {team.members.length} {team.members.length === 1 ? 'member' : 'members'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RoleBadge role={role} />
                      {isSelected && <Check className="h-4 w-4" />}
                    </div>
                  </div>
                </DropdownMenuItem>
              )
            })
          )}

          {pendingInvitations.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="flex items-center gap-2 text-gray-600">
                Pending Invitations
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {pendingInvitations.length}
                </span>
              </DropdownMenuLabel>
              {pendingInvitations.map((invitation) => {
                const team = userTeams.find(t => t.id === invitation.teamId)
                const inviterName = invitation.invitedBy // In real app, would look up user name

                return (
                  <div
                    key={invitation.id}
                    className="flex flex-col gap-2 border-l-2 border-blue-500 bg-blue-50 px-3 py-2 mx-1 mb-1"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {team?.name || 'Team Invitation'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Invited by {inviterName}
                        </p>
                        {invitation.message && (
                          <p className="mt-1 text-xs italic text-muted-foreground">
                            "{invitation.message}"
                          </p>
                        )}
                      </div>
                      <RoleBadge role={invitation.role} />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleAcceptInvitation(invitation.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleDeclineInvitation(invitation.id)}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </div>

        <DropdownMenuSeparator />

        <div className="p-1 bg-white">
          <DropdownMenuItem
            onSelect={() => {
              setOpen(false)
              onCreateTeam?.()
            }}
            className="gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create New Team
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              setOpen(false)
              onManageTeams?.()
            }}
            className="gap-2 cursor-pointer"
          >
            <Settings className="h-4 w-4" />
            Manage Teams
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
