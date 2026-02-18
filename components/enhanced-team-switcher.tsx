"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useTeam } from "@/hooks/useTeam"
import { getUserTeams } from "@/lib/mockData"

interface EnhancedTeamSwitcherProps {
  onCreateTeam?: () => void
}

export function EnhancedTeamSwitcher({ onCreateTeam }: EnhancedTeamSwitcherProps) {
  const {
    currentUser,
    currentTeam,
    switchTeam,
    pendingInvitations,
    acceptInvitation,
    declineInvitation,
  } = useTeam()

  const [open, setOpen] = useState(false)
  const [isPersonal, setIsPersonal] = useState(false)

  const userTeams = getUserTeams(currentUser.id)

  const handleSwitchTeam = (teamId: string) => {
    switchTeam(teamId)
    setIsPersonal(false)
    setOpen(false)
  }

  const handleSelectPersonal = () => {
    setIsPersonal(true)
    setOpen(false)
  }

  const getTeamInitials = (name: string) =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  const getUserRole = (teamId: string) => {
    const team = userTeams.find(t => t.id === teamId)
    const member = team?.members.find(m => m.userId === currentUser.id)
    return member?.role || 'Collaborator'
  }

  const triggerLabel = isPersonal ? 'My Workspace' : currentTeam?.name || 'Select workspace'
  const triggerInitials = isPersonal ? currentUser.name.charAt(0) : currentTeam ? getTeamInitials(currentTeam.name) : '?'

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="h-9 px-2 justify-between gap-2 hover:bg-gray-100 text-gray-800"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-[10px] bg-gray-200 text-gray-700">
                {triggerInitials}
              </AvatarFallback>
            </Avatar>
            <span className="truncate text-sm font-medium">{triggerLabel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {pendingInvitations.length > 0 && (
              <span className="flex h-1.5 w-1.5 rounded-full bg-red-500" />
            )}
            <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-gray-400" />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 p-1.5 bg-white border-gray-200 shadow-lg rounded-xl">

        {/* Personal */}
        <p className="px-2 pt-1 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Personal</p>
        <DropdownMenuItem
          onSelect={handleSelectPersonal}
          className="flex items-center gap-2.5 px-2 py-2 rounded-lg cursor-pointer"
        >
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-xs bg-blue-50 text-blue-600">
              {currentUser.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col min-w-0">
            <span className="text-sm font-medium leading-tight">My Workspace</span>
            <span className="text-xs text-gray-400 leading-tight truncate">{currentUser.email}</span>
          </div>
          {isPersonal && <Check className="h-3.5 w-3.5 text-gray-500 shrink-0" />}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1.5 bg-gray-100" />

        {/* Teams */}
        <p className="px-2 pt-0.5 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Teams</p>
        <div className="max-h-[240px] overflow-y-auto">
          {userTeams.length === 0 ? (
            <p className="px-2 py-4 text-center text-sm text-gray-400">No teams yet</p>
          ) : (
            userTeams.map((team) => {
              const role = getUserRole(team.id)
              const isSelected = !isPersonal && currentTeam?.id === team.id

              return (
                <DropdownMenuItem
                  key={team.id}
                  onSelect={() => handleSwitchTeam(team.id)}
                  className="flex items-center gap-2.5 px-2 py-2 rounded-lg cursor-pointer"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs bg-gray-100 text-gray-600">
                      {getTeamInitials(team.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col min-w-0">
                    <span className="text-sm font-medium leading-tight">{team.name}</span>
                    <span className="text-xs text-gray-400 leading-tight">
                      {team.members.length} {team.members.length === 1 ? 'member' : 'members'} · {role}
                    </span>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-gray-500 shrink-0" />}
                </DropdownMenuItem>
              )
            })
          )}

          {/* Pending invitations */}
          {pendingInvitations.length > 0 && (
            <>
              <DropdownMenuSeparator className="my-1.5 bg-gray-100" />
              <p className="px-2 pt-0.5 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                Invitations
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] text-white font-bold">
                  {pendingInvitations.length}
                </span>
              </p>
              {pendingInvitations.map((invitation) => {
                const team = userTeams.find(t => t.id === invitation.teamId)
                return (
                  <div
                    key={invitation.id}
                    className="flex flex-col gap-2 rounded-lg bg-gray-50 px-2.5 py-2 mb-1"
                  >
                    <div>
                      <p className="text-sm font-medium leading-tight">
                        {team?.name || 'Team Invitation'}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        as {invitation.role} · from {invitation.invitedBy}
                      </p>
                      {invitation.message && (
                        <p className="mt-1 text-xs text-gray-400 italic">"{invitation.message}"</p>
                      )}
                    </div>
                    <div className="flex gap-1.5">
                      <Button
                        size="sm"
                        className="flex-1 h-7 text-xs"
                        onClick={() => acceptInvitation(invitation.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-7 text-xs"
                        onClick={() => declineInvitation(invitation.id)}
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

        <DropdownMenuSeparator className="my-1.5 bg-gray-100" />

        <DropdownMenuItem
          onSelect={() => { setOpen(false); onCreateTeam?.() }}
          className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer text-gray-600"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm">Create team</span>
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
