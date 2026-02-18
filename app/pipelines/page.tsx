"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  LayoutGrid,
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Edit,
  Share2,
} from "lucide-react"
import { useTeam } from "@/hooks/useTeam"
import Link from "next/link"

export default function MyPipelinesPage() {
  const { currentUser, pipelines } = useTeam()

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)

  const myPersonalPipelines = pipelines.filter(p => p.ownerId === currentUser.id)

  const personalFolders = [
    { id: "pf1", name: "Active Research", parentId: undefined },
    { id: "pf2", name: "Experiments", parentId: "pf1" },
    { id: "pf3", name: "Archives", parentId: undefined },
  ]

  const rootFolders = personalFolders.filter(f => !f.parentId)
  const getChildFolders = (parentId: string) =>
    personalFolders.filter(f => f.parentId === parentId)

  const displayedPipelines = myPersonalPipelines

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
            <div className="flex items-end justify-between mb-8 pb-6 border-b border-gray-200">
              <div>
                <h1 className="text-[32px] font-semibold">Pipelines</h1>
                <p className="text-gray-500 mt-1">
                  Personal workspace · {myPersonalPipelines.length} {myPersonalPipelines.length === 1 ? "pipeline" : "pipelines"}
                </p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New pipeline
              </Button>
            </div>

            {/* ── Two-column layout ─────────────────────────────────── */}
            <div className="grid grid-cols-12 gap-6">

              {/* Left: folder nav */}
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

              {/* Right: pipeline list */}
              <div className="col-span-9">
                {displayedPipelines.length === 0 ? (
                  <div className="py-24 text-center">
                    <LayoutGrid className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-1">No pipelines yet</p>
                    <p className="text-gray-500 mb-6">Create your first pipeline to get started</p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New pipeline
                    </Button>
                  </div>
                ) : (
                  <div>
                    {displayedPipelines.map(pipeline => (
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
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-700 shrink-0"
                          onClick={e => e.preventDefault()}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

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
