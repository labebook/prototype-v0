"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import {
  Search,
  Plus,
  FolderPlus,
  ArrowRight,
  Clock,
  Star,
  TrendingUp,
  Users,
  LayoutGrid,
} from "lucide-react"
import { useTeam } from "@/hooks/useTeam"
import { getUserById } from "@/lib/mockData"

export default function DashboardPage() {
  const { currentTeam, currentUser, projects, pipelines } = useTeam()

  if (!currentTeam) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">No Team Selected</h2>
              <p className="text-gray-600">Please select a team to view your dashboard</p>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    )
  }

  // Get user's recent pipelines (last 5)
  const myPipelines = pipelines.filter(p => p.ownerId === currentUser.id)
  const recentPipelines = myPipelines.slice(0, 5)

  // Get team projects
  const teamProjects = projects.filter(p => p.teamId === currentTeam.id).slice(0, 3)

  // Pinned methods (mock data)
  const pinnedMethods = [
    { id: 1, name: "Western Blot", category: "Protein Analysis", href: "/methods/western-blot" },
    { id: 2, name: "RNA Isolation", category: "RNA/DNA", href: "/methods/rna-isolation" },
    { id: 3, name: "SDS-PAGE", category: "Protein Analysis", href: "/methods/sds-page" },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto max-w-7xl p-8">
            {/* Welcome Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {currentUser.name.split(' ')[0]}!
              </h1>
              <p className="text-gray-600">
                Team: <span className="font-medium">{currentTeam.name}</span>
              </p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  asChild
                  variant="outline"
                  className="h-auto py-4 justify-start hover:bg-blue-50 hover:border-blue-500 transition-all"
                >
                  <Link href="/methods" className="flex flex-col items-start">
                    <div className="flex items-center mb-2">
                      <Search className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium">Browse Methods</span>
                    </div>
                    <span className="text-sm text-gray-600">Explore scientific methods library</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-auto py-4 justify-start hover:bg-green-50 hover:border-green-500 transition-all"
                >
                  <Link href="/pipelines/new" className="flex flex-col items-start">
                    <div className="flex items-center mb-2">
                      <Plus className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-medium">New Pipeline in Project</span>
                    </div>
                    <span className="text-sm text-gray-600">Create a new experimental pipeline</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-auto py-4 justify-start hover:bg-purple-50 hover:border-purple-500 transition-all"
                >
                  <Link href="/projects" className="flex flex-col items-start">
                    <div className="flex items-center mb-2">
                      <FolderPlus className="h-5 w-5 text-purple-600 mr-2" />
                      <span className="font-medium">Create Project</span>
                    </div>
                    <span className="text-sm text-gray-600">Start a new research project</span>
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-gray-600" />
                    Recent Activity
                  </h2>
                  <Link href="/pipelines" className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                    View all
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>

                {recentPipelines.length > 0 ? (
                  <div className="space-y-3">
                    {recentPipelines.map((pipeline) => {
                      const owner = getUserById(pipeline.ownerId)
                      return (
                        <Link
                          key={pipeline.id}
                          href={`/pipeline/${pipeline.id}`}
                          className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 mb-1">{pipeline.name}</p>
                              <p className="text-sm text-gray-600 truncate">{pipeline.description.goal}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Modified {formatDate(pipeline.lastModified)}
                              </p>
                            </div>
                            {pipeline.isReady && (
                              <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                                Ready
                              </span>
                            )}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <LayoutGrid className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No recent pipelines</p>
                  </div>
                )}
              </div>

              {/* Pinned Methods */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-500 fill-yellow-500" />
                    Pinned Methods
                  </h2>
                  <Link href="/methods" className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                    Browse all
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {pinnedMethods.map((method) => (
                    <Link
                      key={method.id}
                      href={method.href}
                      className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{method.name}</p>
                          <p className="text-sm text-gray-600">{method.category}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Team Projects */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center">
                    <Users className="h-5 w-5 mr-2 text-gray-600" />
                    Team Projects
                  </h2>
                  <Link href="/projects" className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                    View all
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>

                {teamProjects.length > 0 ? (
                  <div className="space-y-3">
                    {teamProjects.map((project) => {
                      const owner = getUserById(project.ownerId)
                      return (
                        <Link
                          key={project.id}
                          href={`/projects/${project.id}`}
                          className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                        >
                          <p className="font-medium text-gray-900 mb-1">{project.name}</p>
                          <p className="text-sm text-gray-600 truncate mb-2">{project.description}</p>
                          <p className="text-xs text-gray-500">
                            Owner: {owner?.name || 'Unknown'}
                          </p>
                        </Link>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No team projects yet</p>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold flex items-center mb-4">
                  <TrendingUp className="h-5 w-5 mr-2 text-gray-600" />
                  Quick Stats
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-700">{myPipelines.length}</p>
                    <p className="text-sm text-blue-600">My Pipelines</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-700">{teamProjects.length}</p>
                    <p className="text-sm text-green-600">Team Projects</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-700">{currentTeam.members.length}</p>
                    <p className="text-sm text-purple-600">Team Members</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-700">{pinnedMethods.length}</p>
                    <p className="text-sm text-yellow-600">Pinned Methods</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
