"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ChevronRight,
  Edit,
  FileText,
  Folder,
  LayoutGrid,
  Plus,
  Share2,
  Trash2,
} from "lucide-react"
import { useTeam } from "@/hooks/useTeam"
import { getUserById } from "@/lib/mockData"
import Link from "next/link"

type FilterTab = "all" | "pipelines" | "files"

const mockProjectFiles = [
  { id: "file-1", name: "Protocol_v2.pdf",      ext: "PDF",  size: "2.4 MB", date: "2025-03-15" },
  { id: "file-2", name: "Results_Q1.xlsx",       ext: "XLSX", size: "1.1 MB", date: "2025-03-10" },
  { id: "file-3", name: "Reagents_list.docx",   ext: "DOCX", size: "340 KB", date: "2025-02-28" },
]

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string

  const { currentTeam, projects, projectFolders, pipelines, canEdit } = useTeam()

  const project = projects.find(p => p.id === projectId)

  const [filterTab, setFilterTab] = useState<FilterTab>("all")
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [folderPath, setFolderPath] = useState<Array<{ id: string; name: string }>>([])

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
              <Button onClick={() => router.push("/projects")}>
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

  const owner = getUserById(project.ownerId)
  const lastModifiedBy = project.lastModifiedBy ? getUserById(project.lastModifiedBy) : null
  const canEditProject = canEdit("project", project.id)

  const allFolders = projectFolders.filter(f => f.teamId === currentTeam.id)
  const levelFolders = currentFolderId
    ? allFolders.filter(f => f.parentId === currentFolderId)
    : allFolders.filter(f => !f.parentId)

  const projectPipelines = pipelines.filter(p => p.teamId === currentTeam.id)

  const navigateIntoFolder = (folder: { id: string; name: string }) => {
    setCurrentFolderId(folder.id)
    setFolderPath(prev => [...prev, { id: folder.id, name: folder.name }])
  }

  const navigateToBreadcrumb = (index: number) => {
    if (index === -1) {
      setCurrentFolderId(null)
      setFolderPath([])
    } else {
      const newPath = folderPath.slice(0, index + 1)
      setCurrentFolderId(newPath[newPath.length - 1].id)
      setFolderPath(newPath)
    }
  }

  const switchTab = (tab: FilterTab) => {
    setFilterTab(tab)
    setCurrentFolderId(null)
    setFolderPath([])
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
    })

  const filterTabs: { id: FilterTab; label: string }[] = [
    { id: "all",       label: "All" },
    { id: "pipelines", label: "Pipelines" },
    { id: "files",     label: "Files" },
  ]

  const addButtonLabel =
    filterTab === "files"     ? "Upload file" :
    filterTab === "pipelines" ? "Add pipeline" :
                                "New"

  // ── Column header row ───────────────────────────────────────────────────
  const ColumnHeaders = () => (
    <div className="flex items-center gap-4 -mx-6 px-6 py-2 border-b border-gray-100">
      <div className="h-5 w-5 shrink-0" />
      <div className="flex-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</div>
      <div className="w-20 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</div>
      <div className="w-32 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Modified</div>
      <div className="w-5 shrink-0" />
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1200px] px-6 py-8">

            {/* ── Breadcrumb ────────────────────────────────────────── */}
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Projects
            </Link>

            {/* ── Page header ───────────────────────────────────────── */}
            <div className="flex items-start justify-between pb-6 border-b border-gray-200">
              <div>
                <h1 className="text-[32px] font-semibold">{project.name}</h1>
                {project.description && (
                  <p className="text-gray-500 mt-1">{project.description}</p>
                )}
                <p className="text-sm text-gray-400 mt-2">
                  {owner?.name ?? "Unknown"}
                  {" · "}
                  Created {formatDate(project.createdDate)}
                  {lastModifiedBy && ` · Modified by ${lastModifiedBy.name}`}
                </p>
              </div>
              {canEditProject && (
                <div className="flex items-center gap-2 mt-1">
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
                    <Share2 className="mr-1.5 h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
                    <Edit className="mr-1.5 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* ── Filter tab bar + Add button ───────────────────────── */}
            <div className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex">
                  {filterTabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => switchTab(tab.id)}
                      className={`px-4 py-3 text-base transition-colors ${
                        filterTab === tab.id
                          ? "border-b-2 border-black font-bold text-gray-900"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  {addButtonLabel}
                </Button>
              </div>
            </div>

            {/* ── Folder breadcrumb (All tab only) ─────────────────── */}
            {filterTab === "all" && folderPath.length > 0 && (
              <div className="flex items-center gap-1.5 py-3 text-sm border-b border-gray-100">
                <button
                  onClick={() => navigateToBreadcrumb(-1)}
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                  {project.name}
                </button>
                {folderPath.map((folder, index) => (
                  <div key={folder.id} className="flex items-center gap-1.5">
                    <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                    {index === folderPath.length - 1 ? (
                      <span className="text-gray-900 font-medium">{folder.name}</span>
                    ) : (
                      <button
                        onClick={() => navigateToBreadcrumb(index)}
                        className="text-gray-500 hover:text-gray-900 transition-colors"
                      >
                        {folder.name}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── Column headers ────────────────────────────────────── */}
            <ColumnHeaders />

            {/* ── All tab ───────────────────────────────────────────── */}
            {filterTab === "all" && (
              <div>
                {levelFolders.length === 0 && projectPipelines.length === 0 && mockProjectFiles.length === 0 && (
                  <div className="py-24 text-center">
                    <LayoutGrid className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">This project is empty</p>
                  </div>
                )}

                {/* Folders */}
                {levelFolders.map(folder => (
                  <button
                    key={folder.id}
                    onClick={() => navigateIntoFolder(folder)}
                    className="group flex items-center gap-4 w-full py-3 border-b border-gray-100 hover:bg-gray-50 -mx-6 px-6 transition-colors text-left"
                  >
                    <Folder className="h-5 w-5 text-gray-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-900">{folder.name}</span>
                    </div>
                    <div className="w-20 text-right">
                      <span className="text-xs text-gray-400">Folder</span>
                    </div>
                    <div className="w-32 text-right">
                      <span className="text-sm text-gray-400">—</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}

                {/* Pipelines (root level only) */}
                {currentFolderId === null && projectPipelines.map(pipeline => (
                  <Link
                    key={pipeline.id}
                    href={`/pipeline/${pipeline.id}`}
                    className="group flex items-center gap-4 py-3 border-b border-gray-100 hover:bg-gray-50 -mx-6 px-6 transition-colors"
                  >
                    <LayoutGrid className="h-5 w-5 text-gray-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{pipeline.name}</span>
                        {pipeline.isReady ? (
                          <Badge className="bg-green-100 text-green-700 border-0 text-xs">Ready</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">In progress</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{pipeline.description.goal}</p>
                    </div>
                    <div className="w-20 text-right">
                      <span className="text-xs text-gray-400">Pipeline</span>
                    </div>
                    <div className="w-32 text-right">
                      <span className="text-sm text-gray-400">{formatDate(pipeline.lastModified)}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}

                {/* Files (root level only) */}
                {currentFolderId === null && mockProjectFiles.map(file => (
                  <div
                    key={file.id}
                    className="group flex items-center gap-4 py-3 border-b border-gray-100 hover:bg-gray-50 -mx-6 px-6 transition-colors cursor-default"
                  >
                    <FileText className="h-5 w-5 text-gray-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-900">{file.name}</span>
                      <p className="text-xs text-gray-400 mt-0.5">{file.size}</p>
                    </div>
                    <div className="w-20 text-right">
                      <span className="text-xs text-gray-400">{file.ext}</span>
                    </div>
                    <div className="w-32 text-right">
                      <span className="text-sm text-gray-400">{formatDate(file.date)}</span>
                    </div>
                    <div className="w-5 shrink-0" />
                  </div>
                ))}
              </div>
            )}

            {/* ── Pipelines tab ─────────────────────────────────────── */}
            {filterTab === "pipelines" && (
              <div>
                {projectPipelines.length === 0 ? (
                  <div className="py-24 text-center">
                    <LayoutGrid className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No pipelines yet</p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add pipeline
                    </Button>
                  </div>
                ) : (
                  projectPipelines.map(pipeline => (
                    <Link
                      key={pipeline.id}
                      href={`/pipeline/${pipeline.id}`}
                      className="group flex items-center gap-4 py-3 border-b border-gray-100 hover:bg-gray-50 -mx-6 px-6 transition-colors"
                    >
                      <LayoutGrid className="h-5 w-5 text-gray-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{pipeline.name}</span>
                          {pipeline.isReady ? (
                            <Badge className="bg-green-100 text-green-700 border-0 text-xs">Ready</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">In progress</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{pipeline.description.goal}</p>
                      </div>
                      <div className="w-20 text-right">
                        <span className="text-xs text-gray-400">Pipeline</span>
                      </div>
                      <div className="w-32 text-right">
                        <span className="text-sm text-gray-400">{formatDate(pipeline.lastModified)}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))
                )}
              </div>
            )}

            {/* ── Files tab ─────────────────────────────────────────── */}
            {filterTab === "files" && (
              <div>
                {mockProjectFiles.length === 0 ? (
                  <div className="py-24 text-center">
                    <FileText className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No files yet</p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Upload file
                    </Button>
                  </div>
                ) : (
                  mockProjectFiles.map(file => (
                    <div
                      key={file.id}
                      className="group flex items-center gap-4 py-3 border-b border-gray-100 hover:bg-gray-50 -mx-6 px-6 transition-colors cursor-default"
                    >
                      <FileText className="h-5 w-5 text-gray-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-900">{file.name}</span>
                        <p className="text-xs text-gray-400 mt-0.5">{file.size}</p>
                      </div>
                      <div className="w-20 text-right">
                        <span className="text-xs text-gray-400">{file.ext}</span>
                      </div>
                      <div className="w-32 text-right">
                        <span className="text-sm text-gray-400">{formatDate(file.date)}</span>
                      </div>
                      <div className="w-5 shrink-0" />
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
