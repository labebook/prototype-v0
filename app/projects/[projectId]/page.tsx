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
  ChevronDown,
  ChevronRight,
  Edit,
  Folder,
  FolderOpen,
  LayoutGrid,
  Plus,
  Share2,
  Trash2,
  User,
} from "lucide-react"
import { useTeam } from "@/hooks/useTeam"
import { getUserById } from "@/lib/mockData"
import Link from "next/link"

type Tab = "pipelines" | "files" | "notes" | "activity"

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string

  const { currentTeam, currentUser, projects, projectFolders, pipelines, canEdit } = useTeam()

  const project = projects.find(p => p.id === projectId)

  const [activeTab, setActiveTab] = useState<Tab>("pipelines")
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)

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

  const projectSpecificFolders = projectFolders.filter(f => f.teamId === currentTeam.id)
  const rootFolders = projectSpecificFolders.filter(f => !f.parentId)
  const getChildFolders = (parentId: string) =>
    projectSpecificFolders.filter(f => f.parentId === parentId)

  const projectPipelines = pipelines.filter(p => p.teamId === currentTeam.id)

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
    })

  const tabs: { id: Tab; label: string }[] = [
    { id: "pipelines", label: "Pipelines" },
    { id: "files", label: "Files" },
    { id: "notes", label: "Notes" },
    { id: "activity", label: "Activity" },
  ]

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
            <div className="flex items-start justify-between pb-6 border-b border-gray-200 mb-0">
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

            {/* ── Tabs ──────────────────────────────────────────────── */}
            <div className="border-b border-gray-200 mb-8">
              <div className="flex">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-base transition-colors ${
                      activeTab === tab.id
                        ? "border-b-2 border-black font-bold text-gray-900"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Pipelines tab ─────────────────────────────────────── */}
            {activeTab === "pipelines" && (
              <div className="grid grid-cols-12 gap-6">

                {/* Folder nav */}
                <div className="col-span-3">
                  <nav className="sticky top-4">
                    <div className="flex items-center justify-between mb-2 px-4">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Folders</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-700">
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <ul className="space-y-1">
                      <li>
                        <button
                          onClick={() => setSelectedFolderId(null)}
                          className={`flex items-center gap-2 w-full h-10 px-4 text-left transition-colors ${
                            selectedFolderId === null
                              ? "rounded-2xl bg-black text-white font-medium"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          <LayoutGrid className="h-4 w-4 shrink-0" />
                          All pipelines
                        </button>
                      </li>
                      {rootFolders.map(folder => (
                        <FolderTreeItem
                          key={folder.id}
                          folder={folder}
                          childFolders={getChildFolders(folder.id)}
                          selectedFolderId={selectedFolderId}
                          onSelect={setSelectedFolderId}
                          level={0}
                        />
                      ))}
                    </ul>
                  </nav>
                </div>

                {/* Pipeline list */}
                <div className="col-span-9">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-0">
                    <span className="text-sm text-gray-500">
                      {selectedFolderId
                        ? projectSpecificFolders.find(f => f.id === selectedFolderId)?.name
                        : `${projectPipelines.length} ${projectPipelines.length === 1 ? "pipeline" : "pipelines"}`}
                    </span>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add pipeline
                    </Button>
                  </div>

                  {projectPipelines.length === 0 ? (
                    <div className="py-24 text-center">
                      <LayoutGrid className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-700 mb-1">No pipelines yet</p>
                      <p className="text-gray-500 mb-6">Add pipelines to track your experimental workflows</p>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add pipeline
                      </Button>
                    </div>
                  ) : (
                    <div>
                      {projectPipelines.map(pipeline => (
                        <Link
                          key={pipeline.id}
                          href={`/pipeline/${pipeline.id}`}
                          className="group flex items-center gap-6 py-5 border-b border-gray-200 hover:bg-gray-50 -mx-6 px-6 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-base font-medium text-gray-900">{pipeline.name}</span>
                              {pipeline.isReady ? (
                                <Badge className="bg-green-100 text-green-700 border-0 text-xs">Ready</Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">In progress</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 truncate">{pipeline.description.goal}</p>
                          </div>
                          <div className="text-right shrink-0 text-sm text-gray-400">
                            {pipeline.shareCount && pipeline.shareCount > 0 && (
                              <p className="flex items-center justify-end gap-1 mb-0.5">
                                <Share2 className="h-3 w-3" />
                                Shared with {pipeline.shareCount}
                              </p>
                            )}
                            <p>{formatDate(pipeline.lastModified)}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-700 shrink-0"
                            onClick={e => e.preventDefault()}
                          >
                            Open →
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Files tab ─────────────────────────────────────────── */}
            {activeTab === "files" && (
              <div className="py-24 text-center">
                <p className="text-lg font-medium text-gray-700 mb-1">No files yet</p>
                <p className="text-gray-500 mb-6">Upload files, documents, and data related to this project</p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload file
                </Button>
              </div>
            )}

            {/* ── Notes tab ─────────────────────────────────────────── */}
            {activeTab === "notes" && (
              <div className="py-24 text-center">
                <p className="text-lg font-medium text-gray-700 mb-1">No notes yet</p>
                <p className="text-gray-500 mb-6">Add notes, observations, and documentation for this project</p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add note
                </Button>
              </div>
            )}

            {/* ── Activity tab ──────────────────────────────────────── */}
            {activeTab === "activity" && (
              <div>
                <div className="flex items-start gap-4 py-5 border-b border-gray-200">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{owner?.name}</span> created this project
                    </p>
                    <p className="text-sm text-gray-400 mt-0.5">{formatDate(project.createdDate)}</p>
                  </div>
                </div>
                {lastModifiedBy && (
                  <div className="flex items-start gap-4 py-5 border-b border-gray-200">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <Edit className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{lastModifiedBy.name}</span> updated this project
                      </p>
                      <p className="text-sm text-gray-400 mt-0.5">
                        {formatDate(project.lastModifiedDate || project.createdDate)}
                      </p>
                    </div>
                  </div>
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

interface FolderTreeItemProps {
  folder: { id: string; name: string; parentId?: string }
  childFolders: { id: string; name: string; parentId?: string }[]
  selectedFolderId: string | null
  onSelect: (folderId: string) => void
  level: number
}

function FolderTreeItem({ folder, childFolders, selectedFolderId, onSelect, level }: FolderTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = childFolders.length > 0
  const isSelected = selectedFolderId === folder.id

  return (
    <div>
      <button
        onClick={() => onSelect(folder.id)}
        className={`flex items-center gap-2 w-full h-10 px-4 text-left transition-colors ${
          isSelected
            ? "rounded-2xl bg-black text-white font-medium"
            : "text-gray-600 hover:text-gray-900"
        }`}
        style={{ paddingLeft: `${level * 12 + 16}px` }}
      >
        {hasChildren && (
          <span
            role="button"
            onClick={e => { e.stopPropagation(); setIsExpanded(!isExpanded) }}
            className="shrink-0"
          >
            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </span>
        )}
        {!hasChildren && <span className="w-3 shrink-0" />}
        {isExpanded
          ? <FolderOpen className="h-4 w-4 shrink-0" />
          : <Folder className="h-4 w-4 shrink-0" />}
        <span className="truncate">{folder.name}</span>
      </button>
      {hasChildren && isExpanded && (
        <div className="mt-0.5">
          {childFolders.map(child => (
            <FolderTreeItem
              key={child.id}
              folder={child}
              childFolders={[]}
              selectedFolderId={selectedFolderId}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
