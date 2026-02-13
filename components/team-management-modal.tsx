"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { RoleBadge } from "@/components/ui/role-badge"
import { InviteMemberDialog } from "@/components/invite-member-dialog"
import { useTeam } from "@/hooks/useTeam"
import { getUserById } from "@/lib/mockData"
import { Mail, Trash2, UserPlus, X, RefreshCw } from "lucide-react"
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

interface TeamManagementModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TeamManagementModal({
  open,
  onOpenChange,
}: TeamManagementModalProps) {
  const {
    currentTeam,
    currentUser,
    isPI,
    removeMember,
    cancelInvitation,
    resendInvitation,
  } = useTeam()

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null)
  const [invitationToCancel, setInvitationToCancel] = useState<string | null>(null)

  if (!currentTeam) return null

  const userIsPI = isPI(currentTeam.id)

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

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl">{currentTeam.name}</DialogTitle>
            {currentTeam.description && (
              <p className="text-sm text-muted-foreground">{currentTeam.description}</p>
            )}
          </DialogHeader>

          <Tabs defaultValue="overview" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="members">
                Members ({currentTeam.members.length})
              </TabsTrigger>
              <TabsTrigger value="invitations">
                Invitations ({currentTeam.invitations.filter(i => i.status === 'pending').length})
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto mt-4">
              <TabsContent value="overview" className="mt-0">
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Team Information</h3>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Created</dt>
                          <dd className="font-medium">{formatDate(currentTeam.createdDate)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Members</dt>
                          <dd className="font-medium">{currentTeam.members.length}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Created by</dt>
                          <dd className="font-medium">
                            {getUserById(currentTeam.createdBy)?.name || 'Unknown'}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold">Your Role</h3>
                      <div className="flex items-center gap-2">
                        <RoleBadge role={userIsPI ? 'PI' : 'Collaborator'} />
                        <span className="text-sm text-gray-600">
                          {userIsPI
                            ? 'You have full administrative access'
                            : 'You can view and edit shared resources'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {currentTeam.description && (
                    <div className="space-y-2">
                      <h3 className="font-semibold">Description</h3>
                      <p className="text-sm text-gray-600">{currentTeam.description}</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="members" className="mt-0">
                <div className="space-y-4">
                  {userIsPI && (
                    <div className="flex justify-end">
                      <Button onClick={() => setInviteDialogOpen(true)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Invite Member
                      </Button>
                    </div>
                  )}

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        {userIsPI && <TableHead className="text-right">Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentTeam.members.map((member) => {
                        const user = getUserById(member.userId)
                        if (!user) return null

                        const isCurrentUser = user.id === currentUser.id
                        const canRemove = userIsPI && !isCurrentUser

                        return (
                          <TableRow key={member.userId}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>
                                    {getUserInitials(user.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  {isCurrentUser && (
                                    <p className="text-xs text-muted-foreground">(You)</p>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {user.email}
                            </TableCell>
                            <TableCell>
                              <RoleBadge role={member.role} />
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(member.joinedDate)}
                            </TableCell>
                            {userIsPI && (
                              <TableCell className="text-right">
                                {canRemove && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setMemberToRemove(member.userId)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                )}
                              </TableCell>
                            )}
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="invitations" className="mt-0">
                <div className="space-y-4">
                  {userIsPI && (
                    <div className="flex justify-end">
                      <Button onClick={() => setInviteDialogOpen(true)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Invitation
                      </Button>
                    </div>
                  )}

                  {currentTeam.invitations.filter(i => i.status === 'pending').length === 0 ? (
                    <div className="py-12 text-center">
                      <Mail className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-4 text-sm text-muted-foreground">
                        No pending invitations
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Invited By</TableHead>
                          <TableHead>Sent</TableHead>
                          <TableHead>Status</TableHead>
                          {userIsPI && <TableHead className="text-right">Actions</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentTeam.invitations
                          .filter(invitation => invitation.status === 'pending')
                          .map((invitation) => {
                            const inviter = getUserById(invitation.invitedBy)

                            return (
                              <TableRow key={invitation.id}>
                                <TableCell className="font-medium">
                                  {invitation.invitedEmail}
                                </TableCell>
                                <TableCell>
                                  <RoleBadge role={invitation.role} />
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {inviter?.name || 'Unknown'}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {formatDate(invitation.createdDate)}
                                </TableCell>
                                <TableCell>
                                  <span className="text-sm text-yellow-600 dark:text-yellow-400">
                                    Pending
                                  </span>
                                </TableCell>
                                {userIsPI && (
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => resendInvitation(invitation.id)}
                                        title="Resend invitation"
                                      >
                                        <RefreshCw className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setInvitationToCancel(invitation.id)}
                                        title="Cancel invitation"
                                      >
                                        <X className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                )}
                              </TableRow>
                            )
                          })}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Invite Member Dialog */}
      <InviteMemberDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        teamId={currentTeam.id}
      />

      {/* Remove Member Confirmation */}
      <AlertDialog open={!!memberToRemove} onOpenChange={() => setMemberToRemove(null)}>
        <AlertDialogContent className="bg-white border-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this member from the team? They will lose access to
              all team resources.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveMember} className="bg-destructive">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Invitation Confirmation */}
      <AlertDialog open={!!invitationToCancel} onOpenChange={() => setInvitationToCancel(null)}>
        <AlertDialogContent className="bg-white border-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Invitation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this invitation? The recipient will not be able to
              join the team using this invitation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Invitation</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelInvitation}>Cancel Invitation</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
