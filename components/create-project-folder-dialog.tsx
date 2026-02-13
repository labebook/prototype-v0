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
import { useTeam } from "@/hooks/useTeam"

interface CreateProjectFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parentFolderId?: string | null
  onCreateFolder: (name: string, parentId?: string) => void
}

export function CreateProjectFolderDialog({
  open,
  onOpenChange,
  parentFolderId,
  onCreateFolder,
}: CreateProjectFolderDialogProps) {
  const { currentTeam, projectFolders } = useTeam()
  const [name, setName] = useState("")
  const [selectedParent, setSelectedParent] = useState<string>(parentFolderId || "root")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get root folders for parent selection
  const rootFolders = projectFolders.filter(
    f => f.teamId === currentTeam?.id && !f.parentId
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300))

    const parentId = selectedParent === "root" ? undefined : selectedParent
    onCreateFolder(name.trim(), parentId)

    // Reset form
    setName("")
    setSelectedParent("root")
    setIsSubmitting(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white border-gray-200">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Project Folder</DialogTitle>
            <DialogDescription>
              Create a folder to organize your projects in {currentTeam?.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="project-folder-name">Folder Name *</Label>
              <Input
                id="project-folder-name"
                placeholder="e.g., Active Research"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-white border-gray-300"
                autoFocus
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="parent-folder">Parent Folder</Label>
              <Select value={selectedParent} onValueChange={setSelectedParent}>
                <SelectTrigger id="parent-folder" className="bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="root">Root (No Parent)</SelectItem>
                  {rootFolders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Create a nested folder by selecting a parent folder
              </p>
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
            <Button type="submit" disabled={isSubmitting || !name.trim()}>
              {isSubmitting ? 'Creating...' : 'Create Folder'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
