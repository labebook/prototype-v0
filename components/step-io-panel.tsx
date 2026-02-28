"use client"

import { X, FileImage, FileIcon, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PipelineStep {
  id: string
  step: number
  name: string
  category: string
  executionStatus?: "idle" | "running" | "completed" | "failed"
}

interface IoData {
  text: string
  files: File[]
}

interface StepIoPanelProps {
  step: PipelineStep | null
  inputData?: IoData
  outputData?: IoData
  onClose: () => void
  onEditOutput: () => void
}

function FileChip({ file }: { file: File }) {
  const isImage = file.type.startsWith("image/")
  return (
    <div className="flex items-center gap-1.5 bg-gray-100 rounded-md px-2 py-1 text-xs text-gray-700 max-w-full">
      {isImage ? (
        <FileImage className="h-3.5 w-3.5 shrink-0 text-gray-500" />
      ) : (
        <FileIcon className="h-3.5 w-3.5 shrink-0 text-gray-500" />
      )}
      <span className="truncate">{file.name}</span>
    </div>
  )
}

function IoSection({ label, data }: { label: string; data?: IoData }) {
  const hasText = data?.text && data.text.trim().length > 0
  const hasFiles = data?.files && data.files.length > 0
  const isEmpty = !hasText && !hasFiles

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">{label}</p>
      {isEmpty ? (
        <p className="text-sm text-gray-400">—</p>
      ) : (
        <div className="space-y-2">
          {hasText && (
            <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{data!.text}</p>
          )}
          {hasFiles && (
            <div className="flex flex-wrap gap-1.5">
              {data!.files.map((f, i) => (
                <FileChip key={i} file={f} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function StepIoPanel({ step, inputData, outputData, onClose, onEditOutput }: StepIoPanelProps) {
  if (!step) return null

  const hasOutput = outputData && (outputData.text.trim().length > 0 || outputData.files.length > 0)

  const statusColors: Record<string, string> = {
    completed: "bg-green-100 text-green-700",
    running: "bg-blue-100 text-blue-700",
    failed: "bg-red-100 text-red-700",
    idle: "bg-gray-100 text-gray-600",
  }
  const status = step.executionStatus ?? "idle"
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1)

  return (
    <div className="w-[320px] shrink-0 border border-gray-200 rounded-lg bg-white flex flex-col h-fit sticky top-0">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-gray-100">
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400 font-medium">Step {step.step}</span>
            <Badge className={cn("text-xs border-0", statusColors[status])}>
              {statusLabel}
            </Badge>
          </div>
          <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">{step.name}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 p-4 space-y-5 overflow-y-auto">
        <IoSection label="Input" data={inputData} />
        <div className="border-t border-gray-100" />
        <IoSection label="Output" data={outputData} />
      </div>

      {/* Footer */}
      {hasOutput && (
        <div className="p-4 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onEditOutput}
          >
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
            Edit Output
          </Button>
        </div>
      )}
    </div>
  )
}
