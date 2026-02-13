"use client"

import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Folder, Plus, Settings } from "lucide-react"
import { PermissionBadge } from "@/components/ui/permission-badge"
import { useTeam } from "@/hooks/useTeam"
import { getUserById } from "@/lib/mockData"
import Link from "next/link"

export default function FolderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const folderId = params.folderId as string

  const {
    currentTeam,
    pipelineFolders,
    pipelines,
    canEdit,
  } = useTeam()

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

  // Find the folder
  const folder = pipelineFolders.find(f => f.id === folderId)

  if (!folder) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Folder Not Found</h2>
              <p className="text-gray-600 mb-6">The folder you're looking for doesn't exist</p>
              <Button onClick={() => router.push('/pipelines')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Pipelines
              </Button>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    )
  }

  // Get pipelines in this folder
  const folderPipelines = pipelines.filter(p => p.folderId === folderId)
  const createdBy = getUserById(folder.createdBy)
  const canEditFolder = canEdit('folder', folderId)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-7xl p-8">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => router.push('/pipelines')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Pipelines
            </Button>

            {/* Folder Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Folder className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-3xl font-semibold">{folder.name}</h1>
                    <PermissionBadge
                      canEdit={canEditFolder}
                      shareCount={folder.editPermissions.length}
                    />
                  </div>
                  <p className="text-gray-600">
                    Created by {createdBy?.name || 'Unknown'} on {formatDate(folder.createdDate)}
                    {' • '} {folderPipelines.length} {folderPipelines.length === 1 ? 'pipeline' : 'pipelines'}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {canEditFolder && (
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Folder
                  </Button>
                )}
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Pipeline
                </Button>
              </div>
            </div>

            {/* Pipelines List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Pipelines in this folder</h2>

              {folderPipelines.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Pipelines Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Add pipelines to this folder to organize your experiments
                  </p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Pipeline
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {folderPipelines.map((pipeline) => {
                    const owner = getUserById(pipeline.ownerId)

                    return (
                      <Link
                        key={pipeline.id}
                        href={`/pipeline/${pipeline.id}`}
                        className="block bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-500 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{pipeline.name}</h3>
                              <PermissionBadge
                                canEdit={canEdit('pipeline', pipeline.id)}
                                shareCount={pipeline.shareCount}
                              />
                            </div>
                            <p className="text-gray-600 mb-2">{pipeline.description.goal}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Owner: {owner?.name}</span>
                              <span>•</span>
                              <span>Modified: {formatDate(pipeline.lastModified)}</span>
                              {pipeline.isReady && (
                                <>
                                  <span>•</span>
                                  <span className="text-green-600 font-medium">Ready</span>
                                </>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <span>Open →</span>
                          </Button>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
