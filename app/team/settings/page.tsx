"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { RoleBadge } from "@/components/ui/role-badge"
import { InviteMemberDialog } from "@/components/invite-member-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useTeam } from "@/hooks/useTeam"
import { getUserById } from "@/lib/mockData"
import { Check, Mail, Pencil, RefreshCw, Trash2, UserPlus, X } from "lucide-react"

export default function TeamSettingsPage() {
  const router = useRouter()
  const {
    currentTeam,
    currentUser,
    isPI,
    removeMember,
    cancelInvitation,
    resendInvitation,
    renameTeam,
    deleteTeam,
  } = useTeam()

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null)
  const [invitationToCancel, setInvitationToCancel] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [draftName, setDraftName] = useState("")
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isRenaming) nameInputRef.current?.focus()
  }, [isRenaming])

  if (!currentTeam) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">No Team Selected</h2>
              <p className="text-gray-600">Please select a team first.</p>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    )
  }

  const userIsPI = isPI(currentTeam.id)
  const pendingInvitations = currentTeam.invitations.filter(i => i.status === "pending")

  const getInitials = (name: string) =>
    name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
    })

  const startRename = () => {
    setDraftName(currentTeam.name)
    setIsRenaming(true)
  }

  const confirmRename = () => {
    const trimmed = draftName.trim()
    if (trimmed && trimmed !== currentTeam.name) renameTeam(currentTeam.id, trimmed)
    setIsRenaming(false)
  }

  const cancelRename = () => setIsRenaming(false)

  const handleRemoveMember = () => {
    if (memberToRemove) {
      removeMember(currentTeam.id, memberToRemove)
      setMemberToRemove(null)
    }
  }

  const handleCancelInvitation = () => {
    if (invitationToCancel) {
      cancelInvitation(invitationToCancel)
      setInvitationToCancel(null)
    }
  }

  const handleDelete = () => {
    deleteTeam(currentTeam.id)
    router.push("/projects")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1200px] px-6 py-8">

            {/* ── Page header ───────────────────────────────────────── */}
            <div className="mb-10 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                {isRenaming ? (
                  <>
                    <Input
                      ref={nameInputRef}
                      value={draftName}
                      onChange={e => setDraftName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") confirmRename()
                        if (e.key === "Escape") cancelRename()
                      }}
                      className="h-10 text-[28px] font-semibold w-72 px-2 py-0 leading-none"
                    />
                    <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={confirmRename}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600" onClick={cancelRename}>
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <h1 className="text-[32px] font-semibold">{currentTeam.name}</h1>
                    {userIsPI && (
                      <Button variant="ghost" size="icon" className="text-gray-300 hover:text-gray-500 mt-1" onClick={startRename}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </>
                )}
              </div>
              <p className="text-gray-500">
                {currentTeam.members.length} {currentTeam.members.length === 1 ? "member" : "members"} · Created {formatDate(currentTeam.createdDate)}
              </p>
            </div>

            <div className="space-y-12">

                {/* ── Members ───────────────────────────────────────── */}
                <section>
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">
                      Members
                      <span className="ml-2 text-base font-normal text-gray-400">{currentTeam.members.length}</span>
                    </h2>
                    {userIsPI && (
                      <Button size="sm" onClick={() => setInviteDialogOpen(true)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Invite member
                      </Button>
                    )}
                  </div>

                  <div>
                    {currentTeam.members.map(member => {
                      const user = getUserById(member.userId)
                      if (!user) return null
                      const isCurrentUser = user.id === currentUser.id
                      return (
                        <div
                          key={member.userId}
                          className="group flex items-center gap-4 py-4 border-b border-gray-100"
                        >
                          <Avatar className="h-9 w-9 flex-shrink-0">
                            <AvatarFallback className="text-sm bg-gray-100 text-gray-600">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {user.name}
                              {isCurrentUser && (
                                <span className="ml-1.5 text-xs text-gray-400 font-normal">you</span>
                              )}
                            </p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                          <RoleBadge role={member.role} />
                          <div className="w-8 flex justify-end">
                            {userIsPI && !isCurrentUser && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                                onClick={() => setMemberToRemove(member.userId)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>

                {/* ── Invitations ───────────────────────────────────── */}
                <section>
                  <div className="pb-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">
                      Pending invitations
                      <span className="ml-2 text-base font-normal text-gray-400">{pendingInvitations.length}</span>
                    </h2>
                  </div>

                  {pendingInvitations.length === 0 ? (
                    <p className="py-8 text-gray-400">No pending invitations</p>
                  ) : (
                    <div>
                      {pendingInvitations.map(invitation => {
                        const inviter = getUserById(invitation.invitedBy)
                        return (
                          <div
                            key={invitation.id}
                            className="group flex items-center gap-4 py-4 border-b border-gray-100"
                          >
                            <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <Mail className="h-4 w-4 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{invitation.invitedEmail}</p>
                              <p className="text-sm text-gray-500">
                                Invited by {inviter?.name ?? "Unknown"} · {formatDate(invitation.createdDate)}
                              </p>
                            </div>
                            <RoleBadge role={invitation.role} />
                            {userIsPI && (
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-gray-400 hover:text-gray-700"
                                  onClick={() => resendInvitation(invitation.id)}
                                  title="Resend"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-gray-400 hover:text-red-500"
                                  onClick={() => setInvitationToCancel(invitation.id)}
                                  title="Cancel invitation"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </section>

                {/* ── Danger zone ───────────────────────────────────── */}
                {userIsPI && (
                  <section>
                    <div className="pb-4 border-b border-red-200">
                      <h2 className="text-xl font-semibold text-red-500">Danger zone</h2>
                    </div>
                    <div className="flex items-center justify-between py-6 border-b border-gray-100">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Delete this team</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          Permanently removes the team and all its data. This cannot be undone.
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                        onClick={() => setDeleteDialogOpen(true)}
                      >
                        Delete team
                      </Button>
                    </div>
                  </section>
                )}

            </div>
          </div>
        </main>
      </div>
      <Footer />

      <InviteMemberDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        teamId={currentTeam.id}
      />

      <AlertDialog open={!!memberToRemove} onOpenChange={() => setMemberToRemove(null)}>
        <AlertDialogContent className="bg-white border-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove team member</AlertDialogTitle>
            <AlertDialogDescription>
              This member will lose access to all team resources. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveMember} className="bg-destructive">Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!invitationToCancel} onOpenChange={() => setInvitationToCancel(null)}>
        <AlertDialogContent className="bg-white border-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel invitation</AlertDialogTitle>
            <AlertDialogDescription>
              The recipient will no longer be able to join using this invitation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep invitation</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelInvitation}>Cancel invitation</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{currentTeam.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the team and all its data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">Delete team</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
