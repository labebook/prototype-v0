"use client"

import { useState } from "react"
import { Check, UserMinus, UserPlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { RoleBadge } from "@/components/ui/role-badge"
import { useTeam } from "@/hooks/useTeam"
import { getUserById } from "@/lib/mockData"

interface ShareProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
}

export function ShareProjectDialog({
  open,
  onOpenChange,
  projectId,
}: ShareProjectDialogProps) {
  const {
    currentTeam,
    currentUser,
    projects,
    addProjectParticipant,
    removeProjectParticipant,
    getProjectParticipants,
  } = useTeam()

  const project = projects.find(p => p.id === projectId)
  const participants = getProjectParticipants(projectId)
  const participantIds = new Set(participants.map(u => u.id))

  const notYetAdded = (currentTeam?.members ?? [])
    .map(m => getUserById(m.userId))
    .filter(
      (u): u is NonNullable<typeof u> =>
        u !== undefined && !participantIds.has(u.id)
    )

  const getInitials = (name: string) =>
    name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)

  const isOwner = (userId: string) => project?.ownerId === userId

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle>Share project</DialogTitle>
          <DialogDescription>
            Manage who can view and edit this project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">

          {/* Current participants */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Participants ({participants.length})
            </p>
            <div className="space-y-1">
              {participants.map(user => {
                const member = currentTeam?.members.find(m => m.userId === user.id)
                const isMe = user.id === currentUser.id
                const owner = isOwner(user.id)
                return (
                  <div
                    key={user.id}
                    className="group flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-gray-50 transition-colors"
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="text-xs bg-gray-100 text-gray-600">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-tight">
                        {user.name}
                        {isMe && (
                          <span className="ml-1.5 text-xs text-gray-400 font-normal">you</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 leading-tight">{user.email}</p>
                    </div>
                    {member && <RoleBadge role={member.role} />}
                    {owner ? (
                      <span className="text-xs text-gray-400 shrink-0">Owner</span>
                    ) : (
                      !isMe && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-gray-400 hover:text-red-500 transition-all shrink-0"
                          onClick={() => removeProjectParticipant(projectId, user.id)}
                          title="Remove from project"
                        >
                          <UserMinus className="h-3.5 w-3.5" />
                        </Button>
                      )
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Team members not yet added */}
          {notYetAdded.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Add from team
              </p>
              <div className="space-y-1">
                {notYetAdded.map(user => {
                  const member = currentTeam?.members.find(m => m.userId === user.id)
                  return (
                    <div
                      key={user.id}
                      className="group flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="text-xs bg-gray-100 text-gray-400">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-600 leading-tight">{user.name}</p>
                        <p className="text-xs text-gray-400 leading-tight">{user.email}</p>
                      </div>
                      {member && <RoleBadge role={member.role} />}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-400 hover:text-blue-600 transition-all shrink-0"
                        onClick={() => addProjectParticipant(projectId, user.id)}
                        title="Add to project"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
