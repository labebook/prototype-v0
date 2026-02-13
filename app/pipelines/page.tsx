"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Edit, Plus, Share2, Folder, FolderOpen, Trash2, User, Settings } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PermissionBadge } from "@/components/ui/permission-badge"
import { CreateFolderDialog } from "@/components/create-folder-dialog"
import { ManageFolderDialog } from "@/components/manage-folder-dialog"
import { useTeam } from "@/hooks/useTeam"
import { getUserById } from "@/lib/mockData"
import Link from "next/link"

// Define attachment type
interface Attachment {
  id: string
  filename: string
  uploadDate: string
  description?: string
}

interface PipelineFolder {
  id: string
  name: string
  createdDate: string
  createdBy: string
  pipelineCount: number
}

// Update pipeline interface to include folderId
interface Pipeline {
  id: string
  name: string
  description: {
    goal: string
    context: string
  }
  isReady: boolean
  lastModified: string
  shared: boolean
  shareCount?: number
  attachments?: Attachment[]
  link?: string
  folderId?: string // Added folderId to associate pipelines with folders
}

export default function PipelinesPage() {
  const {
    currentTeam,
    currentUser,
    pipelineFolders,
    pipelines: teamPipelines,
    canEdit,
    getMyPipelines,
    getFavouritePipelines,
    getSharedPipelines,
  } = useTeam()

  const router = useRouter()

  // Dialog states
  const [createFolderOpen, setCreateFolderOpen] = useState(false)
  const [manageFolderOpen, setManageFolderOpen] = useState(false)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)

  // Filter folders and pipelines for current team
  const folders = currentTeam
    ? pipelineFolders.filter(f => f.teamId === currentTeam.id)
    : []

  const myPipelines = getMyPipelines()
  const favouritePipelines = getFavouritePipelines()
  const sharedPipelines = getSharedPipelines()

  const handleFolderClick = (folderId: string) => {
    router.push(`/pipelines/${folderId}`)
  }

  const handleCreateFolder = (name: string) => {
    console.log('Creating folder:', name)
    // In real implementation, this would create a folder via API
    // For now, just close the dialog
  }

  const handleUpdateFolder = (folderId: string, name: string, permissions: string[]) => {
    console.log('Updating folder:', folderId, name, permissions)
    // In real implementation, this would update the folder via API
  }

  const handleDeleteFolder = (folderId: string) => {
    console.log('Deleting folder:', folderId)
    // In real implementation, this would delete the folder via API
  }

  const handleManageFolder = (folderId: string) => {
    setSelectedFolderId(folderId)
    setManageFolderOpen(true)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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
              <p className="text-gray-600">Please select a team to view pipelines</p>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 py-8 px-4">
          <div className="container mx-auto max-w-7xl">
            {/* Title and Actions */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-semibold mb-2">Pipelines</h1>
                <p className="text-lg text-gray-600">
                  Team: <span className="font-medium">{currentTeam.name}</span>
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  className="h-12 bg-white border-gray-300 hover:bg-gray-50 text-gray-700 px-4"
                  onClick={() => setCreateFolderOpen(true)}
                >
                  <Folder className="mr-2 h-4 w-4" /> New Folder
                </Button>
                <Button className="h-12 bg-black hover:bg-gray-800 text-white border-0 px-4" asChild>
                  <Link href="/pipelines/new">
                    <Plus className="mr-2 h-4 w-4" /> New Pipeline
                  </Link>
                </Button>
              </div>
            </div>

            {/* My Pipelines */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                My Pipelines ({myPipelines.length})
              </h2>
              {myPipelines.length > 0 ? (
                <div className="space-y-1">
                  {myPipelines.map((pipeline) => {
                    const folder = folders.find(f => f.id === pipeline.folderId)
                    const lastModifiedBy = pipeline.lastModifiedBy
                      ? getUserById(pipeline.lastModifiedBy)?.name
                      : null

                    return (
                      <Link
                        key={pipeline.id}
                        href={`/pipelines/${folder?.id || pipeline.id}`}
                        className="group flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center flex-1 min-w-0 gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-lg truncate">{pipeline.name}</span>
                              <PermissionBadge
                                canEdit={canEdit('pipeline', pipeline.id)}
                                shareCount={pipeline.shareCount}
                              />
                            </div>
                            <p className="text-sm text-gray-600 truncate">{pipeline.description.goal}</p>
                            {lastModifiedBy && (
                              <p className="text-xs text-gray-500 mt-1">
                                Last modified by {lastModifiedBy} on {formatDate(pipeline.lastModified)}
                              </p>
                            )}
                          </div>
                          {folder && (
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Folder className="h-4 w-4" />
                              <span>{folder.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Edit className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No pipelines yet. Create your first pipeline!</p>
                </div>
              )}
            </div>

            {/* Favourites */}
            {favouritePipelines.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4">
                  ⭐ Favourites ({favouritePipelines.length})
                </h2>
                <div className="space-y-1">
                  {/* Same structure as My Pipelines */}
                  <p className="text-sm text-gray-500 p-4">Favourite pipelines would appear here</p>
                </div>
              </div>
            )}

            {/* Shared with Me */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Shared with Me ({sharedPipelines.length})
              </h2>
              {sharedPipelines.length > 0 ? (
                <div className="space-y-1">
                  {sharedPipelines.map((pipeline) => {
                    const folder = folders.find(f => f.id === pipeline.folderId)
                    const owner = getUserById(pipeline.ownerId)
                    const lastModifiedBy = pipeline.lastModifiedBy
                      ? getUserById(pipeline.lastModifiedBy)?.name
                      : null

                    return (
                      <Link
                        key={pipeline.id}
                        href={`/pipelines/${folder?.id || pipeline.id}`}
                        className="group flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center flex-1 min-w-0 gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-lg truncate">{pipeline.name}</span>
                              <PermissionBadge
                                canEdit={canEdit('pipeline', pipeline.id)}
                                shareCount={pipeline.shareCount}
                              />
                            </div>
                            <p className="text-sm text-gray-600 truncate">{pipeline.description.goal}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Owner: {owner?.name || 'Unknown'}
                              {lastModifiedBy && ` • Last modified by ${lastModifiedBy} on ${formatDate(pipeline.lastModified)}`}
                            </p>
                          </div>
                          {folder && (
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Folder className="h-4 w-4" />
                              <span>{folder.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Edit className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No shared pipelines</p>
                </div>
              )}
            </div>

            {/* Folders Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Folder className="h-5 w-5" />
                Folders ({folders.length})
              </h2>
              {folders.length > 0 ? (
                <div className="space-y-1">
                  {folders.map((folder) => {
                    const createdBy = getUserById(folder.createdBy)

                    return (
                      <div
                        key={folder.id}
                        className="group flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors"
                      >
                        <button
                          onClick={() => handleFolderClick(folder.id)}
                          className="flex items-center flex-1 min-w-0 gap-4 text-left"
                        >
                          <Folder className="h-5 w-5 text-blue-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-lg truncate">{folder.name}</span>
                              <PermissionBadge
                                canEdit={canEdit('folder', folder.id)}
                                shareCount={folder.editPermissions.length}
                              />
                            </div>
                            <p className="text-xs text-gray-500">
                              Created by {createdBy?.name || 'Unknown'} on {formatDate(folder.createdDate)}
                              {' • '} {folder.pipelineCount} {folder.pipelineCount === 1 ? 'pipeline' : 'pipelines'}
                            </p>
                          </div>
                        </button>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleManageFolder(folder.id)
                            }}
                            title="Manage folder"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFolderClick(folder.id)}
                            title="Open folder"
                          >
                            <FolderOpen className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No folders in this team</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <Footer />

      {/* Folder Management Dialogs */}
      <CreateFolderDialog
        open={createFolderOpen}
        onOpenChange={setCreateFolderOpen}
        onCreateFolder={handleCreateFolder}
      />

      <ManageFolderDialog
        open={manageFolderOpen}
        onOpenChange={setManageFolderOpen}
        folderId={selectedFolderId}
        onUpdateFolder={handleUpdateFolder}
        onDeleteFolder={handleDeleteFolder}
      />
    </div>
  )
}
