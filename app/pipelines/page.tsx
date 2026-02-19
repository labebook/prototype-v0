"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Folder, LayoutGrid, Plus } from "lucide-react"
import { useTeam } from "@/hooks/useTeam"
import Link from "next/link"

const mockFolders = [
  { id: "f1", name: "Active Research",  parentId: null },
  { id: "f2", name: "Experiments",      parentId: "f1" },
  { id: "f3", name: "Drafts",           parentId: "f1" },
  { id: "f4", name: "Archives",         parentId: null },
  { id: "f5", name: "Shared with me",   parentId: null },
]

export default function MyPipelinesPage() {
  const { currentUser, pipelines } = useTeam()

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [folderPath, setFolderPath] = useState<Array<{ id: string; name: string }>>([])

  const myPipelines = pipelines.filter(p => p.ownerId === currentUser.id)

  const levelFolders = mockFolders.filter(f => f.parentId === currentFolderId)

  // Pipelines only show at root level for this demo
  const visiblePipelines = currentFolderId === null ? myPipelines : []

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

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
    })

  const isEmpty = levelFolders.length === 0 && visiblePipelines.length === 0

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1200px] px-6 py-8">

            {/* ── Page header ───────────────────────────────────────── */}
            <div className="flex items-end justify-between pb-6 border-b border-gray-200 mb-0">
              <div>
                <h1 className="text-[32px] font-semibold">Pipelines</h1>
                <p className="text-gray-500 mt-1">
                  {myPipelines.length} {myPipelines.length === 1 ? "pipeline" : "pipelines"}
                </p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New pipeline
              </Button>
            </div>

            {/* ── Folder breadcrumb ─────────────────────────────────── */}
            {folderPath.length > 0 && (
              <div className="flex items-center gap-1.5 py-3 text-sm border-b border-gray-100">
                <button
                  onClick={() => navigateToBreadcrumb(-1)}
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Pipelines
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
            <div className="flex items-center gap-4 -mx-6 px-6 py-2 border-b border-gray-100">
              <div className="h-5 w-5 shrink-0" />
              <div className="flex-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</div>
              <div className="w-20 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</div>
              <div className="w-32 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Modified</div>
              <div className="w-5 shrink-0" />
            </div>

            {/* ── Empty state ───────────────────────────────────────── */}
            {isEmpty && (
              <div className="py-24 text-center">
                <LayoutGrid className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  {currentFolderId ? "This folder is empty" : "No pipelines yet"}
                </p>
                {currentFolderId === null && (
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New pipeline
                  </Button>
                )}
              </div>
            )}

            {/* ── Folders ───────────────────────────────────────────── */}
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

            {/* ── Pipelines ─────────────────────────────────────────── */}
            {visiblePipelines.map(pipeline => (
              <Link
                key={pipeline.id}
                href={`/pipeline/${pipeline.id}`}
                className="group flex items-center gap-4 py-3 border-b border-gray-100 hover:bg-gray-50 -mx-6 px-6 transition-colors"
              >
                <LayoutGrid className="h-5 w-5 text-gray-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-900">{pipeline.name}</span>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{pipeline.description.goal}</p>
                </div>
                <div className="w-20 text-right">
                  {pipeline.isReady ? (
                    <Badge className="bg-green-100 text-green-700 border-0 text-xs">Ready</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">In progress</Badge>
                  )}
                </div>
                <div className="w-32 text-right">
                  <span className="text-sm text-gray-400">{formatDate(pipeline.lastModified)}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}

          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
