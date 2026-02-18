"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  FolderPlus,
  LayoutGrid,
  Plus,
  Search,
  Share2,
  Star,
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

  const myPipelines = pipelines.filter(p => p.ownerId === currentUser.id)
  const recentPipelines = myPipelines.slice(0, 5)
  const teamProjects = projects.filter(p => p.teamId === currentTeam.id).slice(0, 3)

  const pinnedMethods = [
    { id: 1, name: "Western Blot", category: "Protein Analysis", href: "/methods/western-blot" },
    { id: 2, name: "RNA Isolation", category: "RNA/DNA", href: "/methods/rna-isolation" },
    { id: 3, name: "SDS-PAGE", category: "Protein Analysis", href: "/methods/sds-page" },
  ]

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
            <div className="pb-6 border-b border-gray-200 mb-8">
              <h1 className="text-[32px] font-semibold">
                Welcome back, {currentUser.name.split(" ")[0]}
              </h1>
              <p className="text-gray-500 mt-1">{currentTeam.name}</p>
            </div>

            {/* ── Quick actions ─────────────────────────────────────── */}
            <div className="mb-10">
              <div className="flex items-center gap-3">
                <Button asChild>
                  <Link href="/methods">
                    <Search className="mr-2 h-4 w-4" />
                    Browse methods
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/pipelines">
                    <Plus className="mr-2 h-4 w-4" />
                    New pipeline
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/projects">
                    <FolderPlus className="mr-2 h-4 w-4" />
                    New project
                  </Link>
                </Button>
              </div>
            </div>

            {/* ── Two-column layout ─────────────────────────────────── */}
            <div className="grid grid-cols-12 gap-10">

              {/* Left column: Recent pipelines + Team projects */}
              <div className="col-span-8 space-y-10">

                {/* ── Recent pipelines ──────────────────────────────── */}
                <section>
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">Recent pipelines</h2>
                    <Link
                      href="/pipelines"
                      className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
                    >
                      View all
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  {recentPipelines.length === 0 ? (
                    <div className="py-12 text-center">
                      <LayoutGrid className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No recent pipelines</p>
                      <Button className="mt-4" asChild>
                        <Link href="/pipelines">
                          <Plus className="mr-2 h-4 w-4" />
                          New pipeline
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div>
                      {recentPipelines.map(pipeline => (
                        <Link
                          key={pipeline.id}
                          href={`/pipeline/${pipeline.id}`}
                          className="group flex items-center gap-6 py-4 border-b border-gray-200 hover:bg-gray-50 -mx-6 px-6 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-sm font-medium text-gray-900">{pipeline.name}</span>
                              {pipeline.isReady ? (
                                <Badge className="bg-green-100 text-green-700 border-0 text-xs">Ready</Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">In progress</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 truncate">{pipeline.description.goal}</p>
                          </div>
                          <div className="text-right shrink-0 text-sm text-gray-400">
                            {pipeline.shareCount > 0 && (
                              <p className="flex items-center justify-end gap-1 mb-0.5">
                                <Share2 className="h-3 w-3" />
                                {pipeline.shareCount}
                              </p>
                            )}
                            <p>{formatDate(pipeline.lastModified)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </section>

                {/* ── Team projects ─────────────────────────────────── */}
                <section>
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">Team projects</h2>
                    <Link
                      href="/projects"
                      className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
                    >
                      View all
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  {teamProjects.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-gray-500">No team projects yet</p>
                      <Button className="mt-4" asChild variant="outline">
                        <Link href="/projects">
                          <FolderPlus className="mr-2 h-4 w-4" />
                          New project
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div>
                      {teamProjects.map(project => {
                        const owner = getUserById(project.ownerId)
                        return (
                          <Link
                            key={project.id}
                            href={`/projects/${project.id}`}
                            className="group flex items-center gap-6 py-4 border-b border-gray-200 hover:bg-gray-50 -mx-6 px-6 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 mb-0.5">{project.name}</p>
                              {project.description && (
                                <p className="text-sm text-gray-500 truncate">{project.description}</p>
                              )}
                            </div>
                            <div className="text-right shrink-0 text-sm text-gray-400">
                              <p>{owner?.name ?? "Unknown"}</p>
                              <p className="mt-0.5">{formatDate(project.createdDate)}</p>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </section>
              </div>

              {/* Right column: Pinned methods + Stats */}
              <div className="col-span-4 space-y-10">

                {/* ── Pinned methods ────────────────────────────────── */}
                <section>
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <h2 className="text-base font-semibold flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      Pinned methods
                    </h2>
                    <Link
                      href="/methods"
                      className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
                    >
                      Browse
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div>
                    {pinnedMethods.map(method => (
                      <Link
                        key={method.id}
                        href={method.href}
                        className="flex items-center gap-3 py-3.5 border-b border-gray-200 hover:bg-gray-50 -mx-6 px-6 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{method.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{method.category}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>

                {/* ── Stats ────────────────────────────────────────── */}
                <section>
                  <div className="pb-4 border-b border-gray-200">
                    <h2 className="text-base font-semibold">Overview</h2>
                  </div>
                  <div className="space-y-0">
                    <div className="flex items-center justify-between py-3.5 border-b border-gray-200">
                      <span className="text-sm text-gray-600">My pipelines</span>
                      <span className="text-sm font-semibold text-gray-900">{myPipelines.length}</span>
                    </div>
                    <div className="flex items-center justify-between py-3.5 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Team projects</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {projects.filter(p => p.teamId === currentTeam.id).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3.5 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Team members</span>
                      <span className="text-sm font-semibold text-gray-900">{currentTeam.members.length}</span>
                    </div>
                    <div className="flex items-center justify-between py-3.5 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Ready pipelines</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {myPipelines.filter(p => p.isReady).length}
                      </span>
                    </div>
                  </div>
                </section>

              </div>
            </div>

          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
