"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import {
  Folder,
  FolderOpen,
  FileText,
  Plus,
  ChevronRight,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PermissionBadge } from "@/components/ui/permission-badge"
import { CreateProjectFolderDialog } from "@/components/create-project-folder-dialog"
import { useTeam } from "@/hooks/useTeam"
import { getUserById } from "@/lib/mockData"

export default function ProjectsPage() {
  const router = useRouter()
  const {
    currentTeam,
    currentUser,
    projectFolders,
    projects,
    canEdit,
  } = useTeam()

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [createFolderOpen, setCreateFolderOpen] = useState(false)

  const handleCreateFolder = (name: string, parentId?: string) => {
    console.log('Creating project folder:', name, 'parent:', parentId)
    // In real implementation, this would create a folder via API
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

  // Filter folders and projects for current team
  const folders = projectFolders.filter(f => f.teamId === currentTeam.id)
  const teamProjects = projects.filter(p => p.teamId === currentTeam.id)

  // Get root-level folders (no parent)
  const rootFolders = folders.filter(f => !f.parentId)

  // Get subfolders of selected folder
  const subFolders = selectedFolderId
    ? folders.filter(f => f.parentId === selectedFolderId)
    : []

  // Get projects in selected folder
  const folderProjects = selectedFolderId
    ? teamProjects.filter(p => p.folderId === selectedFolderId)
    : []

  // Get breadcrumb path
  const getBreadcrumbs = () => {
    if (!selectedFolderId) return []
    const path: typeof folders = []
    let currentId: string | undefined = selectedFolderId

    while (currentId) {
      const folder = folders.find(f => f.id === currentId)
      if (!folder) break
      path.unshift(folder)
      currentId = folder.parentId
    }

    return path
  }

  const breadcrumbs = getBreadcrumbs()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 flex">
          {/* Left Panel: Folder Tree */}
          <div className="w-80 border-r border-gray-200 bg-gray-50 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Folders</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  title="New Folder"
                  onClick={() => setCreateFolderOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Root Folders */}
              <div className="space-y-1">
                {rootFolders.length === 0 ? (
                  <p className="text-sm text-gray-500 py-8 text-center">
                    No folders yet
                  </p>
                ) : (
                  rootFolders.map((folder) => {
                    const isSelected = selectedFolderId === folder.id
                    const hasSubfolders = folders.some(f => f.parentId === folder.id)

                    return (
                      <div key={folder.id}>
                        <button
                          onClick={() => setSelectedFolderId(folder.id)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                            isSelected
                              ? 'bg-white text-gray-900 font-medium'
                              : 'text-gray-700 hover:bg-white/50'
                          }`}
                        >
                          {isSelected ? (
                            <FolderOpen className="h-4 w-4 text-blue-500" />
                          ) : (
                            <Folder className="h-4 w-4 text-blue-500" />
                          )}
                          <span className="flex-1 text-left truncate">{folder.name}</span>
                          {hasSubfolders && <ChevronRight className="h-4 w-4" />}
                        </button>

                        {/* Subfolders */}
                        {isSelected && hasSubfolders && (
                          <div className="ml-6 mt-1 space-y-1">
                            {folders
                              .filter(f => f.parentId === folder.id)
                              .map((subfolder) => (
                                <button
                                  key={subfolder.id}
                                  onClick={() => setSelectedFolderId(subfolder.id)}
                                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-white/50 transition-colors"
                                >
                                  <Folder className="h-4 w-4 text-blue-400" />
                                  <span className="flex-1 text-left truncate">{subfolder.name}</span>
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Folder Contents */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8">
              {/* Breadcrumbs */}
              {breadcrumbs.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                  <button
                    onClick={() => setSelectedFolderId(null)}
                    className="hover:text-gray-900"
                  >
                    Projects
                  </button>
                  {breadcrumbs.map((folder, index) => (
                    <div key={folder.id} className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4" />
                      <button
                        onClick={() => setSelectedFolderId(folder.id)}
                        className={
                          index === breadcrumbs.length - 1
                            ? 'font-medium text-gray-900'
                            : 'hover:text-gray-900'
                        }
                      >
                        {folder.name}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-semibold mb-2">
                    {selectedFolderId
                      ? folders.find(f => f.id === selectedFolderId)?.name
                      : 'All Projects'}
                  </h1>
                  <p className="text-gray-600">
                    Team: <span className="font-medium">{currentTeam.name}</span>
                  </p>
                </div>
                <Button className="bg-black hover:bg-gray-800">
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </div>

              {/* No Folder Selected */}
              {!selectedFolderId ? (
                <div className="text-center py-16">
                  <div className="bg-gray-100 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
                    <FolderOpen className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Select a Folder</h3>
                  <p className="text-gray-500 mb-6">
                    Choose a folder from the left panel to view its contents
                  </p>
                </div>
              ) : (
                <>
                  {/* Subfolders */}
                  {subFolders.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                        Folders
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {subFolders.map((folder) => {
                          const createdBy = getUserById(folder.createdBy)

                          return (
                            <button
                              key={folder.id}
                              onClick={() => setSelectedFolderId(folder.id)}
                              className="group flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-sm transition-all text-left"
                            >
                              <Folder className="h-8 w-8 text-blue-500 flex-shrink-0 mt-1" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-medium truncate">{folder.name}</p>
                                  <PermissionBadge
                                    canEdit={canEdit('projectFolder', folder.id)}
                                    shareCount={folder.editPermissions.length}
                                    showText={false}
                                  />
                                </div>
                                <p className="text-xs text-gray-500">
                                  By {createdBy?.name || 'Unknown'}
                                </p>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                      Projects ({folderProjects.length})
                    </h3>
                    {folderProjects.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No projects in this folder</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {folderProjects.map((project) => {
                          const owner = getUserById(project.ownerId)
                          const lastModifiedBy = project.lastModifiedBy
                            ? getUserById(project.lastModifiedBy)?.name
                            : null

                          return (
                            <div
                              key={project.id}
                              className="group relative flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-sm transition-all cursor-pointer"
                              onClick={() => handleOpenProject(project.id)}
                            >
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <FileText className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium truncate">{project.name}</h4>
                                    <PermissionBadge
                                      canEdit={canEdit('project', project.id)}
                                      showText={false}
                                    />
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                    {project.description}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Owner: {owner?.name || 'Unknown'}
                                    {lastModifiedBy && (
                                      <> • Last modified by {lastModifiedBy} on {formatDate(project.lastModifiedDate || project.createdDate)}</>
                                    )}
                                  </p>
                                </div>
                              </div>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600" onClick={(e) => e.stopPropagation()}>
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
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      <Footer />

      {/* Folder Management Dialog */}
      <CreateProjectFolderDialog
        open={createFolderOpen}
        onOpenChange={setCreateFolderOpen}
        parentFolderId={selectedFolderId}
        onCreateFolder={handleCreateFolder}
      />
    </div>
  )
}
