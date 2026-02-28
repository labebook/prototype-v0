"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LayoutGrid, List, Pencil, Save, X } from "lucide-react"
import { NewPipelineEditor } from "@/components/new-pipeline-editor"
import { useTeam } from "@/hooks/useTeam"
import { cn } from "@/lib/utils"

export default function PipelineEditPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string
  const pipelineId = params.pipelineId as string

  const { pipelines } = useTeam()
  const pipeline = pipelines.find(p => p.id === pipelineId)

  const [pipelineName, setPipelineName] = useState(pipeline?.name ?? "")
  const [isEditingName, setIsEditingName] = useState(false)
  const [viewMode, setViewMode] = useState<"visual" | "list">("visual")

  const handleCancel = () => {
    router.push(`/projects/${projectId}/pipeline/${pipelineId}`)
  }

  const handleSave = () => {
    router.push(`/projects/${projectId}/pipeline/${pipelineId}`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col">
        {/* Edit toolbar */}
        <div className="border-b border-gray-200 px-6 py-3 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            {/* Pipeline name with edit toggle */}
            {isEditingName ? (
              <Input
                value={pipelineName}
                onChange={e => setPipelineName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={e => { if (e.key === "Enter" || e.key === "Escape") setIsEditingName(false) }}
                autoFocus
                className="text-lg font-semibold border-gray-300 h-8 py-0 w-64"
              />
            ) : (
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-semibold">{pipelineName}</h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-gray-400 hover:text-gray-700 transition-colors"
                  title="Rename pipeline"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* View toggle */}
            <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
              <button
                className={cn(
                  "px-3 py-1.5 flex items-center text-sm transition-colors",
                  viewMode === "visual" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-600 hover:bg-gray-50"
                )}
                onClick={() => setViewMode("visual")}
              >
                <LayoutGrid className="h-4 w-4 mr-1" />
                Visual
              </button>
              <button
                className={cn(
                  "px-3 py-1.5 flex items-center text-sm transition-colors",
                  viewMode === "list" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-600 hover:bg-gray-50"
                )}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 mr-1" />
                List
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Editor (no sidebar/footer — full-height workspace) */}
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <div className="flex-1 overflow-hidden">
            <NewPipelineEditor
              hideHeader
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
