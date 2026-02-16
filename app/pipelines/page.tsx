"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
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
import { Badge } from "@/components/ui/badge"
import { useTeam } from "@/hooks/useTeam"
import Link from "next/link"

export default function MyPipelinesPage() {
  const router = useRouter()
  const { currentUser, pipelines } = useTeam()

  // State for folder navigation
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)

  // Get personal pipelines (not tied to any team)
  // In prototype, we'll filter by ownerId = currentUser
  // In real app, would have separate "personal" flag
  const myPersonalPipelines = pipelines.filter(p => p.ownerId === currentUser.id)

  // Mock personal folders (in real app, would be separate from team folders)
  const personalFolders = [
    {
      id: 'pf1',
      name: 'Active Research',
      parentId: undefined,
    },
    {
      id: 'pf2',
      name: 'Experiments',
      parentId: 'pf1',
    },
    {
      id: 'pf3',
      name: 'Archives',
      parentId: undefined,
    },
  ]

  // Build folder tree
  const rootFolders = personalFolders.filter(f => !f.parentId)
  const getChildFolders = (parentId: string) =>
    personalFolders.filter(f => f.parentId === parentId)

  // Filter pipelines by selected folder (for prototype, show all)
  const displayedPipelines = selectedFolderId
    ? myPersonalPipelines // In real app, would filter by folderId
    : myPersonalPipelines

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Pipelines</h1>
                <p className="text-gray-600">
                  Personal workspace • {myPersonalPipelines.length} pipelines
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                New Pipeline
              </Button>
            </div>

            {/* Two-column layout: Folders + Pipelines */}
            <div className="flex gap-6">
              {/* Left: Folder Tree */}
              <div className="w-64 flex-shrink-0">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sm">Folders</h3>
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* All Pipelines */}
                  <button
                    onClick={() => setSelectedFolderId(null)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
                      selectedFolderId === null
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                    All Pipelines
                  </button>

                  {/* Folder Tree */}
                  <div className="mt-2 space-y-1">
                    {rootFolders.map((folder) => (
                      <FolderTreeItem
                        key={folder.id}
                        folder={folder}
                        childFolders={getChildFolders(folder.id)}
                        selectedFolderId={selectedFolderId}
                        onSelect={setSelectedFolderId}
                        level={0}
                      />
                    ))}
                  </div>

                  {rootFolders.length === 0 && (
                    <div className="text-center py-6">
                      <Folder className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">No folders yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Pipeline List */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">
                    {selectedFolderId
                      ? personalFolders.find(f => f.id === selectedFolderId)?.name
                      : 'All Pipelines'}
                  </h2>
                </div>

                {displayedPipelines.length === 0 ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <LayoutGrid className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Pipelines Yet</h3>
                    <p className="text-gray-600 mb-4">
                      Create your first personal pipeline to get started
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Pipeline
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {displayedPipelines.map((pipeline) => (
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
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
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

// Folder Tree Item Component
interface FolderTreeItemProps {
  folder: {
    id: string
    name: string
    parentId?: string
  }
  childFolders: { id: string; name: string; parentId?: string }[]
  selectedFolderId: string | null
  onSelect: (folderId: string) => void
  level: number
}

function FolderTreeItem({
  folder,
  childFolders,
  selectedFolderId,
  onSelect,
  level,
}: FolderTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = childFolders.length > 0
  const isSelected = selectedFolderId === folder.id

  return (
    <div>
      <button
        onClick={() => onSelect(folder.id)}
        className={`w-full flex items-center gap-1 px-2 py-1.5 rounded text-sm transition-colors ${
          isSelected
            ? 'bg-blue-50 text-blue-700 font-medium'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            className="p-0.5 hover:bg-gray-200 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        )}
        {!hasChildren && <span className="w-4" />}
        {isExpanded ? (
          <FolderOpen className="h-4 w-4 flex-shrink-0" />
        ) : (
          <Folder className="h-4 w-4 flex-shrink-0" />
        )}
        <span className="truncate">{folder.name}</span>
      </button>
      {hasChildren && isExpanded && (
        <div className="mt-0.5">
          {childFolders.map((child) => (
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
