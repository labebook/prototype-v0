"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, MoreVertical, Edit, Trash2, Plus, Share2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useTeam } from "@/hooks/useTeam"
import { getUserById } from "@/lib/mockData"
import { ShareProjectDialog } from "@/components/share-project-dialog"

export default function ProjectsPage() {
  const router = useRouter()
  const { currentTeam, projects, createProject, updateProject } = useTeam()
  const [showNewProject, setShowNewProject] = useState(false)
  const [newName, setNewName] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [editingProject, setEditingProject] = useState<{ id: string; name: string; description: string } | null>(null)
  const [sharingProjectId, setSharingProjectId] = useState<string | null>(null)

  const handleCreate = () => {
    if (!newName.trim()) return
    const project = createProject(newName.trim(), newDescription.trim())
    setShowNewProject(false)
    setNewName("")
    setNewDescription("")
    router.push(`/projects/${project.id}`)
  }

  const handleEditSave = () => {
    if (!editingProject || !editingProject.name.trim()) return
    updateProject(editingProject.id, { name: editingProject.name.trim(), description: editingProject.description.trim() })
    setEditingProject(null)
  }

  const handleOpenProject = (projectId: string) => {
    router.push(`/projects/${projectId}`)
  }

  if (!currentTeam) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">No Team Selected</h2>
              <p className="text-gray-600">Please select a team to view projects</p>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    )
  }

  const teamProjects = projects.filter(p => p.teamId === currentTeam.id)

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
    })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1200px] px-6 py-8">

            {/* ── Page header ───────────────────────────────────────── */}
            <div className="flex items-end justify-between mb-8 pb-6 border-b border-gray-200">
              <div>
                <h1 className="text-[32px] font-semibold">Projects</h1>
                <p className="text-gray-500 mt-1">
                  {currentTeam.name} · {teamProjects.length} {teamProjects.length === 1 ? "project" : "projects"}
                </p>
              </div>
              <Button onClick={() => setShowNewProject(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New project
              </Button>
            </div>

            {/* ── Projects list ─────────────────────────────────────── */}
            {teamProjects.length === 0 ? (
              <div className="py-24 text-center">
                <FileText className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-1">No projects yet</p>
                <p className="text-gray-500 mb-6">
                  Create your first project to organize pipelines and collaborate with your team
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New project
                </Button>
              </div>
            ) : (
              <div>
                {teamProjects.map(project => {
                  const owner = getUserById(project.ownerId)

                  return (
                    <div
                      key={project.id}
                      className="group flex items-center gap-6 py-5 border-b border-gray-200 cursor-pointer hover:bg-gray-50 -mx-6 px-6 transition-colors"
                      onClick={() => handleOpenProject(project.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-medium text-gray-900 mb-1">{project.name}</p>
                        {project.description && (
                          <p className="text-sm text-gray-500 truncate">{project.description}</p>
                        )}
                      </div>

                      <div className="text-right shrink-0 text-sm text-gray-500">
                        <p>{owner?.name ?? "Unknown"}</p>
                        <p className="text-gray-400 mt-0.5">{formatDate(project.createdDate)}</p>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-gray-700"
                            onClick={e => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                          <DropdownMenuItem onClick={e => { e.stopPropagation(); setEditingProject({ id: project.id, name: project.name, description: project.description ?? "" }) }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={e => { e.stopPropagation(); setSharingProjectId(project.id) }}>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-700 focus:bg-red-50"
                            onClick={e => e.stopPropagation()}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />

      {/* ── Share project dialog ─────────────────────────────────────── */}
      {sharingProjectId && (
        <ShareProjectDialog
          open={!!sharingProjectId}
          onOpenChange={open => { if (!open) setSharingProjectId(null) }}
          projectId={sharingProjectId}
        />
      )}

      {/* ── Edit project dialog ──────────────────────────────────────── */}
      <Dialog open={!!editingProject} onOpenChange={open => { if (!open) setEditingProject(null) }}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Edit project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-proj-name">Project name</Label>
              <Input
                id="edit-proj-name"
                value={editingProject?.name ?? ""}
                onChange={e => setEditingProject(p => p ? { ...p, name: e.target.value } : p)}
                onKeyDown={e => e.key === "Enter" && handleEditSave()}
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-proj-desc">Description <span className="text-gray-400 font-normal">(optional)</span></Label>
              <Textarea
                id="edit-proj-desc"
                value={editingProject?.description ?? ""}
                onChange={e => setEditingProject(p => p ? { ...p, description: e.target.value } : p)}
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingProject(null)}>Cancel</Button>
            <Button onClick={handleEditSave} disabled={!editingProject?.name.trim()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── New project dialog ───────────────────────────────────────── */}
      <Dialog open={showNewProject} onOpenChange={setShowNewProject}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>New project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="proj-name">Project name</Label>
              <Input
                id="proj-name"
                placeholder="e.g. Protein Expression Study"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleCreate()}
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proj-desc">Description <span className="text-gray-400 font-normal">(optional)</span></Label>
              <Textarea
                id="proj-desc"
                placeholder="What is this project about?"
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewProject(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newName.trim()}>Create project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
