"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useTeam } from "@/hooks/useTeam"

export default function PipelineLegacyRedirect() {
  const params = useParams()
  const router = useRouter()
  const pipelineId = params.pipelineId as string
  const { pipelines } = useTeam()

  useEffect(() => {
    const pipeline = pipelines.find(p => p.id === pipelineId)
    if (pipeline?.projectId) {
      router.replace(`/projects/${pipeline.projectId}/pipeline/${pipelineId}`)
    } else {
      // No project association — fall back to the library view
      router.replace(`/pipelines/${pipelineId}`)
    }
  }, [pipelineId, pipelines, router])

  return null
}
