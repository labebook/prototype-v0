"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Users } from "lucide-react"
import { useTeam } from "@/hooks/useTeam"
import { getUserById } from "@/lib/mockData"
import { Checkbox } from "@/components/ui/checkbox"

interface ManageFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  folderId: string | null
  onUpdateFolder: (folderId: string, name: string, permissions: string[]) => void
  onDeleteFolder: (folderId: string) => void
}

export function ManageFolderDialog({
  open,
  onOpenChange,
  folderId,
  onUpdateFolder,
  onDeleteFolder,
}: ManageFolderDialogProps) {
  const { currentTeam, pipelineFolders, isPI } = useTeam()
  const [name, setName] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const folder = folderId ? pipelineFolders.find(f => f.id === folderId) : null
  const userIsPI = currentTeam ? isPI(currentTeam.id) : false

  useEffect(() => {
    if (folder) {
      setName(folder.name)
      setSelectedMembers(folder.editPermissions || [])
    }
  }, [folder])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!folderId || !name.trim()) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300))

    onUpdateFolder(folderId, name.trim(), selectedMembers)

    setIsSubmitting(false)
    onOpenChange(false)
  }

  const handleDelete = () => {
    if (!folderId) return
    onDeleteFolder(folderId)
    setShowDeleteConfirm(false)
    onOpenChange(false)
  }

  const toggleMember = (userId: string) => {
    setSelectedMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  if (!folder || !currentTeam) return null

  const createdBy = getUserById(folder.createdBy)

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] bg-white border-gray-200">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Manage Folder</DialogTitle>
              <DialogDescription>
                Update folder name and permissions
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              {/* Folder Name */}
              <div className="grid gap-2">
                <Label htmlFor="edit-folder-name">Folder Name *</Label>
                <Input
                  id="edit-folder-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-white border-gray-300"
                  disabled={!userIsPI}
                />
              </div>

              {/* Folder Info */}
              <div className="grid gap-2">
                <Label>Folder Information</Label>
                <div className="text-sm space-y-1">
                  <p className="text-gray-600">
                    Created by: <span className="font-medium text-gray-900">{createdBy?.name || 'Unknown'}</span>
                  </p>
                  <p className="text-gray-600">
                    Created: <span className="font-medium text-gray-900">
                      {new Date(folder.createdDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </p>
                  <p className="text-gray-600">
                    Pipelines: <span className="font-medium text-gray-900">{folder.pipelineCount}</span>
                  </p>
                </div>
              </div>

              {/* Permissions */}
              {userIsPI && (
                <div className="grid gap-3">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Edit Permissions
                  </Label>
                  <p className="text-xs text-gray-600">
                    Select team members who can edit pipelines in this folder
                  </p>
                  <div className="border border-gray-200 rounded-lg p-3 max-h-[200px] overflow-y-auto space-y-2">
                    {currentTeam.members.map((member) => {
                      const user = getUserById(member.userId)
                      if (!user) return null

                      return (
                        <div key={member.userId} className="flex items-center gap-2">
                          <Checkbox
                            id={`member-${member.userId}`}
                            checked={selectedMembers.includes(member.userId)}
                            onCheckedChange={() => toggleMember(member.userId)}
                          />
                          <label
                            htmlFor={`member-${member.userId}`}
                            className="text-sm font-medium flex-1 cursor-pointer"
                          >
                            {user.name}
                            <span className="text-xs text-gray-500 ml-2">({member.role})</span>
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex items-center justify-between">
              <div>
                {userIsPI && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isSubmitting}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Folder
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                {userIsPI && (
                  <Button type="submit" disabled={isSubmitting || !name.trim()}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="bg-white border-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Folder?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{folder.name}"?
              {folder.pipelineCount > 0 && (
                <span className="block mt-2 text-orange-600 font-medium">
                  This folder contains {folder.pipelineCount} {folder.pipelineCount === 1 ? 'pipeline' : 'pipelines'}.
                  They will be moved to the root level.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete Folder
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
