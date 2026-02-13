"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Calendar,
  User,
  Edit,
  Trash2,
  Plus,
  LayoutGrid,
  FileText,
  Share2,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PermissionBadge } from "@/components/ui/permission-badge"
import { useTeam } from "@/hooks/useTeam"
import { getUserById } from "@/lib/mockData"
import Link from "next/link"

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string

  const {
    currentTeam,
    currentUser,
    projects,
    projectFolders,
    pipelines,
    canEdit,
  } = useTeam()

  // Find the project
  const project = projects.find(p => p.id === projectId)

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

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Project Not Found</h2>
              <p className="text-gray-600 mb-6">The project you're looking for doesn't exist</p>
              <Button onClick={() => router.push('/projects')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Button>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    )
  }

  const folder = projectFolders.find(f => f.id === project.folderId)
  const owner = getUserById(project.ownerId)
  const lastModifiedBy = project.lastModifiedBy
    ? getUserById(project.lastModifiedBy)
    : null
  const canEditProject = canEdit('project', project.id)

  // Get pipelines associated with this project (in a real app, this would be linked)
  // For now, we'll show sample pipelines from the team
  const projectPipelines = pipelines.filter(p => p.teamId === currentTeam.id).slice(0, 3)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto max-w-7xl p-8">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => router.push('/projects')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>

            {/* Project Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold">{project.name}</h1>
                    <PermissionBadge canEdit={canEditProject} showText={false} />
                  </div>
                  <p className="text-gray-600 text-lg mb-4">{project.description}</p>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Owner: <span className="font-medium">{owner?.name || 'Unknown'}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Created: {formatDate(project.createdDate)}</span>
                    </div>
                    {lastModifiedBy && (
                      <div className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        <span>Last modified by {lastModifiedBy.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Folder Info */}
                  {folder && (
                    <div className="mt-3">
                      <Badge variant="outline" className="text-xs">
                        📁 {folder.name}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {canEditProject && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Project Content */}
            <Tabs defaultValue="pipelines" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="pipelines">
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  Pipelines
                </TabsTrigger>
                <TabsTrigger value="files">
                  <FileText className="mr-2 h-4 w-4" />
                  Files
                </TabsTrigger>
                <TabsTrigger value="notes">
                  <FileText className="mr-2 h-4 w-4" />
                  Notes
                </TabsTrigger>
                <TabsTrigger value="activity">
                  <Calendar className="mr-2 h-4 w-4" />
                  Activity
                </TabsTrigger>
              </TabsList>

              {/* Pipelines Tab */}
              <TabsContent value="pipelines" className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Project Pipelines</h2>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Pipeline
                  </Button>
                </div>

                {projectPipelines.length === 0 ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <LayoutGrid className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Pipelines Yet</h3>
                    <p className="text-gray-600 mb-4">
                      Add pipelines to this project to track your experimental workflows
                    </p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Pipeline
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {projectPipelines.map((pipeline) => (
                      <Link
                        key={pipeline.id}
                        href={`/pipeline/${pipeline.id}`}
                        className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-500 hover:shadow-sm transition-all"
                      >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{pipeline.name}</h3>
                                {pipeline.isReady ? (
                                  <Badge className="bg-green-100 text-green-700">Ready</Badge>
                                ) : (
                                  <Badge variant="outline">In Progress</Badge>
                                )}
                              </div>
                              <p className="text-gray-600 mb-2">{pipeline.description.goal}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>Modified: {formatDate(pipeline.lastModified)}</span>
                                {pipeline.shareCount && pipeline.shareCount > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Share2 className="h-3 w-3" />
                                    Shared with {pipeline.shareCount}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              Open →
                            </Button>
                          </div>
                        </Link>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Files Tab */}
              <TabsContent value="files">
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Files Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Upload files, documents, and data related to this project
                  </p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Upload File
                  </Button>
                </div>
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes">
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Notes Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Add notes, observations, and documentation for this project
                  </p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Note
                  </Button>
                </div>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity">
                <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{owner?.name}</span> created this project
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(project.createdDate)}</p>
                      </div>
                    </div>
                  </div>
                  {lastModifiedBy && (
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Edit className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{lastModifiedBy.name}</span> updated this project
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(project.lastModifiedDate || project.createdDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
