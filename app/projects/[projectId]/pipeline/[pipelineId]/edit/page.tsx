"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { ChevronRight } from "lucide-react"
import { NewPipelineEditor } from "@/components/new-pipeline-editor"
import { useTeam } from "@/hooks/useTeam"
import Link from "next/link"

export default function PipelineEditPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string
  const pipelineId = params.pipelineId as string

  const { pipelines, projects } = useTeam()
  const pipeline = pipelines.find(p => p.id === pipelineId)
  const project = projects.find(p => p.id === projectId)

  const [pipelineName, setPipelineName] = useState(pipeline?.name ?? "")
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
      <div className="flex-1 flex flex-col overflow-hidden">
        <NewPipelineEditor
          context="edit"
          breadcrumb={
            <div className="flex items-center gap-1.5 text-sm text-gray-500 px-6 pt-4 pb-2">
              <Link href="/projects" className="hover:text-gray-900 transition-colors">Projects</Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
              <Link href={`/projects/${projectId}`} className="hover:text-gray-900 transition-colors">
                {project?.name ?? projectId}
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
              <Link href={`/projects/${projectId}/pipeline/${pipelineId}`} className="hover:text-gray-900 transition-colors">
                {pipeline?.name ?? pipelineId}
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
              <span className="text-gray-900">Edit</span>
            </div>
          }
          pipelineName={pipelineName}
          onPipelineNameChange={setPipelineName}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      </div>
    </div>
  )
}
