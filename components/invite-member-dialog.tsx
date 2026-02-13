"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useTeam } from "@/hooks/useTeam"

interface InviteMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teamId: string
}

export function InviteMemberDialog({
  open,
  onOpenChange,
  teamId,
}: InviteMemberDialogProps) {
  const { inviteMember } = useTeam()
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<'PI' | 'Collaborator'>('Collaborator')
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic email validation
    if (!email || !email.includes('@')) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    inviteMember(teamId, email, role, message || undefined)

    // Reset form
    setEmail("")
    setRole('Collaborator')
    setMessage("")
    setIsSubmitting(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white border-gray-200">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your team. They will receive an email with instructions.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white border-gray-300"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={role} onValueChange={(v) => setRole(v as 'PI' | 'Collaborator')}>
                <SelectTrigger id="role" className="bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="Collaborator">Collaborator</SelectItem>
                  <SelectItem value="PI">PI (Principal Investigator)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-600">
                {role === 'PI'
                  ? 'PIs can manage team members and have full access to all resources.'
                  : 'Collaborators can view and edit shared resources based on permissions.'}
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">Personal message (optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a personal message to your invitation..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="bg-white border-gray-300"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !email}>
              {isSubmitting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
