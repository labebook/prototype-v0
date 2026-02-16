"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  User,
  Calendar,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PermissionBadge } from "@/components/ui/permission-badge"
import { useTeam } from "@/hooks/useTeam"
import { getUserById } from "@/lib/mockData"

export default function ProjectsPage() {
  const router = useRouter()
  const {
    currentTeam,
    currentUser,
    projects,
    canEdit,
  } = useTeam()

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

  // Get team projects (flat list)
  const teamProjects = projects.filter(p => p.teamId === currentTeam.id)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto max-w-7xl p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
                <p className="text-gray-600">
                  Team: <span className="font-medium">{currentTeam.name}</span> • {teamProjects.length} projects
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </div>

            {/* Projects List */}
            {teamProjects.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
                <p className="text-gray-600 mb-6">
                  Create your first project to organize pipelines and collaborate with your team
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Project
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {teamProjects.map((project) => {
                  const owner = getUserById(project.ownerId)
                  const lastModifiedBy = project.lastModifiedBy
                    ? getUserById(project.lastModifiedBy)
                    : null

                  return (
                    <div
                      key={project.id}
                      className="group bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => handleOpenProject(project.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <FileText className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                              <PermissionBadge
                                canEdit={canEdit('project', project.id)}
                                showText={false}
                              />
                            </div>
                            <p className="text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>{owner?.name || 'Unknown'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Created {formatDate(project.createdDate)}</span>
                              </div>
                              {lastModifiedBy && (
                                <span>• Modified by {lastModifiedBy.name}</span>
                              )}
                            </div>
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
                          <DropdownMenuContent align="end" className="bg-white">
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
