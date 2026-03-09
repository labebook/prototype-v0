"use client"
import React, { useState, useRef } from "react"
import {
  Grid3X3, FlaskConical, Package, Filter, Play, CheckCircle, XCircle,
  Circle, Loader2, GripVertical, ChevronDown, ChevronUp, FileImage, FileIcon, Pencil,
  LogIn, LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PipelineStep {
  step: number
  name: string
  description?: string
  category: string
  objective: string
  method: string
  ready: boolean
  id: string
  protocolId?: string
  parametersState?: "none" | "selected" | "configured"
  dateSelected?: string
  author?: string
  executionStatus?: 'idle' | 'running' | 'completed' | 'failed'
}

interface IoData {
  text: string
  files: File[]
}

interface PipelineListViewProps {
  steps: PipelineStep[]
  onParametersClick?: (step: PipelineStep) => void
  onProtocolClick?: (step: PipelineStep) => void
  onBuffersClick?: (step: PipelineStep) => void
  onCalculationsClick?: (step: PipelineStep) => void
  onMaterialsClick?: (step: PipelineStep) => void
  onPlanClick?: (step: PipelineStep) => void
  onRunStep?: (stepId: string) => void
  onEditOutput?: (stepId: string) => void
  completedModules?: Set<string>
  updatedStepId?: string | null
  hideColumns?: ('status' | 'action' | 'parameters' | 'protocol' | 'dateSelected' | 'author')[]
  showCreatedColumn?: boolean
  onInputClick?: (step: PipelineStep) => void
  onOutputClick?: (step: PipelineStep) => void
  showMethodIcon?: boolean
  onReorder?: (newSteps: PipelineStep[]) => void
  // kept for backward-compat (e.g. editor page)
  onStepClick?: (step: PipelineStep) => void
  selectedStepId?: string | null
  moduleDataMap?: Record<string, { inputData: IoData; outputData: IoData; startedAt?: string; completedAt?: string }>
}

// ── File chip ────────────────────────────────────────────────────────────────
function FileChip({ file }: { file: File }) {
  const isImage = file.type.startsWith("image/")
  return (
    <div className="flex items-center gap-1.5 bg-gray-100 rounded-md px-2 py-1 text-xs text-gray-700 max-w-full">
      {isImage
        ? <FileImage className="h-3 w-3 shrink-0 text-gray-500" />
        : <FileIcon  className="h-3 w-3 shrink-0 text-gray-500" />}
      <span className="truncate">{file.name}</span>
    </div>
  )
}

// ── I/O section ──────────────────────────────────────────────────────────────
function IoSection({ label, data }: { label: string; data?: IoData }) {
  const hasText  = Boolean(data?.text?.trim())
  const hasFiles = Boolean(data?.files?.length)
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">{label}</p>
      {!hasText && !hasFiles ? (
        <p className="text-sm text-gray-400">—</p>
      ) : (
        <div className="space-y-1.5">
          {hasText && <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{data!.text}</p>}
          {hasFiles && (
            <div className="flex flex-wrap gap-1">
              {data!.files.map((f, i) => <FileChip key={i} file={f} />)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function PipelineListView({
  steps,
  onParametersClick,
  onProtocolClick,
  onBuffersClick,
  onCalculationsClick,
  onMaterialsClick,
  onPlanClick,
  onRunStep,
  onEditOutput,
  completedModules,
  updatedStepId,
  hideColumns = [],
  showMethodIcon = false,
  showCreatedColumn = false,
  onInputClick,
  onOutputClick,
  onReorder,
  onStepClick,
  selectedStepId,
  moduleDataMap,
}: PipelineListViewProps) {
  const showStatus      = !hideColumns.includes('status')
  const showAction      = !hideColumns.includes('action')
  const showParameters  = !hideColumns.includes('parameters')
  const showProtocol    = !hideColumns.includes('protocol')
  const showDateSelected = !hideColumns.includes('dateSelected')
  const showAuthor      = !hideColumns.includes('author')

  // Internal accordion state
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const draggedIdRef = useRef<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  if (!steps || !Array.isArray(steps)) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
        <h2 className="text-lg font-semibold text-gray-700">No steps yet</h2>
        <p className="text-sm text-gray-500">
          Switch back to <strong>Visual</strong> view or use the left sidebar to add methods.
        </p>
      </div>
    )
  }

  const getParametersButtonColor = (step: PipelineStep) => {
    if (!step.protocolId)                       return "text-gray-400 bg-gray-100"
    if (step.parametersState === "selected")    return "text-orange-600 bg-orange-100"
    if (step.parametersState === "configured")  return "text-green-600 bg-green-100"
    return "text-gray-400 bg-gray-100"
  }

  const getExecutionStatusBadge = (status?: 'idle' | 'running' | 'completed' | 'failed') => {
    if (!status || status === 'idle')
      return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200"><Circle className="mr-1 h-3 w-3" />Idle</Badge>
    if (status === 'running')
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200"><Loader2 className="mr-1 h-3 w-3 animate-spin" />Running</Badge>
    if (status === 'completed')
      return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle className="mr-1 h-3 w-3" />Completed</Badge>
    if (status === 'failed')
      return <Badge className="bg-red-100 text-red-700 border-red-200"><XCircle className="mr-1 h-3 w-3" />Failed</Badge>
    return null
  }

  const getStepWithMockData = (step: PipelineStep, index: number) => {
    if (step.protocolId) {
      return { ...step, parametersState: step.parametersState || ("none" as const), dateSelected: step.dateSelected, author: step.author }
    }
    if (index === 0) return { ...step, protocolId: undefined, parametersState: "none" as const, dateSelected: undefined, author: undefined }
    if (index === 1) return { ...step, protocolId: "#202", parametersState: "selected" as const, dateSelected: "2025-03-15", author: "Dr. Smith" }
    if (index === 2) return { ...step, protocolId: "#305", parametersState: "configured" as const, dateSelected: "2025-03-18", author: "Dr. Johnson" }
    return {
      ...step,
      protocolId: index % 2 === 0 ? `#${300 + index}` : undefined,
      parametersState: index % 3 === 0 ? "configured" : ((index % 2 === 0 ? "selected" : "none") as const),
      dateSelected: index % 2 === 0 ? "2025-03-20" : undefined,
      author: index % 2 === 0 ? "Current User" : undefined,
    }
  }

  if (steps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
        <h2 className="text-lg font-semibold text-gray-700">No steps yet</h2>
        <p className="text-sm text-gray-500">Switch back to <strong>Visual</strong> view or use the left sidebar to add methods.</p>
      </div>
    )
  }

  const handleDragStart = (id: string) => { draggedIdRef.current = id }
  const handleDragOver  = (e: React.DragEvent, id: string) => { e.preventDefault(); if (draggedIdRef.current !== id) setDragOverId(id) }
  const handleDrop = (targetId: string) => {
    const sourceId = draggedIdRef.current
    if (!sourceId || sourceId === targetId || !onReorder) return
    const from = steps.findIndex(s => s.id === sourceId)
    const to   = steps.findIndex(s => s.id === targetId)
    if (from === -1 || to === -1) return
    const reordered = [...steps]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(to, 0, moved)
    onReorder(reordered)
    draggedIdRef.current = null
    setDragOverId(null)
  }
  const handleDragEnd = () => { draggedIdRef.current = null; setDragOverId(null) }

  // Total colspan for the accordion row
  const totalCols =
    (onReorder ? 1 : 0) +
    1 +                             // Method Name
    1 +                             // Plan
    (showParameters ? 1 : 0) +     // Parameters
    (showProtocol   ? 1 : 0) +     // Protocol ID
    1 +                             // Materials
    1 +                             // Buffer Recipes
    (showCreatedColumn ? 1 : 0) +  // Created (combined)
    (showDateSelected  ? 1 : 0) +  // Date Selected
    (showAuthor        ? 1 : 0) +  // Author
    (showStatus ? 1 : 0) +
    (showAction ? 1 : 0) +
    (onInputClick  ? 1 : 0) +      // Input
    (onOutputClick ? 1 : 0)        // Output

  return (
    <div className="w-full h-full overflow-auto">
      <table className="w-full border-collapse" role="table">
        <thead>
          <tr className="border-b border-gray-200">
            {onReorder && <th className="w-8 py-3 px-2" />}
            <th className="w-[250px] py-3 px-4 text-left   text-sm font-medium text-gray-500">Method Name</th>
            <th className="w-[80px]  py-3 px-4 text-center text-sm font-medium text-gray-500">Plan</th>
            {showParameters && <th className="w-[80px]  py-3 px-4 text-center text-sm font-medium text-gray-500">Parameters</th>}
            {showProtocol   && <th className="w-[100px] py-3 px-4 text-left   text-sm font-medium text-gray-500">Protocol ID</th>}
            <th className="w-[80px]  py-3 px-4 text-center text-sm font-medium text-gray-500">Materials</th>
            <th className="w-[80px]  py-3 px-4 text-center text-sm font-medium text-gray-500">Buffer Recipes</th>
            {showCreatedColumn && <th className="w-[150px] py-3 px-4 text-left text-sm font-medium text-gray-500">Created</th>}
            {!showCreatedColumn && showDateSelected && <th className="w-[120px] py-3 px-4 text-left text-sm font-medium text-gray-500">Date Created</th>}
            {!showCreatedColumn && showAuthor      && <th className="w-[120px] py-3 px-4 text-left text-sm font-medium text-gray-500">Author</th>}
            {showStatus && <th className="w-[130px] py-3 px-4 text-left   text-sm font-medium text-gray-500">Status</th>}
            {showAction && <th className="w-[100px] py-3 px-4 text-center text-sm font-medium text-gray-500">Action</th>}
            {onInputClick  && <th className="w-[160px] py-3 px-4 text-left text-sm font-medium text-gray-500">Input</th>}
            {onOutputClick && <th className="w-[160px] py-3 px-4 text-left text-sm font-medium text-gray-500">Output</th>}
          </tr>
        </thead>
        <tbody>
          {steps.map((originalStep, index) => {
            const step        = getStepWithMockData(originalStep, index)
            const isCompleted = completedModules?.has(step.id) || step.executionStatus === 'completed'
            const stepIoData  = moduleDataMap?.[step.id]
            const hasIo       = Boolean(stepIoData?.inputData || stepIoData?.outputData)
            const fileCount   = (stepIoData?.inputData.files.length ?? 0) + (stepIoData?.outputData.files.length ?? 0)
            const isExpanded  = expandedId === step.id
            const prevStep    = index > 0 ? steps[index - 1] : null
            const prevCompleted = !prevStep || completedModules?.has(prevStep.id) || prevStep.executionStatus === 'completed'

            const toggleExpand = (e: React.MouseEvent) => {
              e.stopPropagation()
              setExpandedId(isExpanded ? null : step.id)
            }

            return (
              <React.Fragment key={step.id}>
                <tr
                  draggable={!!onReorder}
                  onDragStart={onReorder ? () => handleDragStart(step.id) : undefined}
                  onDragOver={onReorder  ? (e) => handleDragOver(e, step.id) : undefined}
                  onDrop={onReorder      ? () => handleDrop(step.id) : undefined}
                  onDragEnd={onReorder   ? handleDragEnd : undefined}
                  onClick={onStepClick   ? () => onStepClick(step) : undefined}
                  className={cn(
                    "border-b border-gray-200 transition-colors",
                    isCompleted && !isExpanded ? "bg-gray-50 opacity-70" : "hover:bg-gray-50",
                    updatedStepId === step.id   ? "bg-green-50 hover:bg-green-50" : "",
                    dragOverId    === step.id   ? "border-t-2 border-t-black" : "",
                    onReorder   ? "cursor-default" : "",
                    onStepClick ? "cursor-pointer" : "",
                    selectedStepId === step.id  ? "bg-blue-50 hover:bg-blue-50" : "",
                    isExpanded  ? "bg-blue-50 hover:bg-blue-50" : "",
                  )}
                >
                  {onReorder && (
                    <td className="py-4 px-2">
                      <GripVertical className="h-4 w-4 text-gray-300 cursor-grab" />
                    </td>
                  )}
                  <td className="py-4 px-4 align-top">
                    <div className="flex items-start gap-3 min-h-[56px]">
                      {showMethodIcon && (
                        <FlaskConical className="shrink-0 h-4 w-4 text-gray-400 mt-0.5" />
                      )}
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900">{step.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                          {step.description || step.objective || ""}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center align-top">
                    <div className="flex items-center justify-center">
                      <button
                        className="w-8 h-8 rounded-md flex items-center justify-center text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); onPlanClick?.(step) }}
                        title="Configure module filters"
                      >
                        <Filter className="h-4 w-4" />
                      </button>
                      {updatedStepId === step.id && (
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Updated</span>
                      )}
                    </div>
                  </td>
                  {showParameters && (
                    <td className="py-4 px-4 text-center align-top">
                      <button
                        className={cn("w-8 h-8 rounded-md flex items-center justify-center transition-colors cursor-pointer", getParametersButtonColor(step))}
                        onClick={(e) => { e.stopPropagation(); onParametersClick?.(step) }}
                        title="Configure parameters"
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </button>
                    </td>
                  )}
                  {showProtocol && (
                    <td className="py-4 px-4 align-top">
                      {step.protocolId === "CM-001" ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); onProtocolClick?.(step) }}
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium"
                        >
                          {step.protocolId}
                        </button>
                      ) : (
                        <div className="text-sm text-gray-600">{step.protocolId || "—"}</div>
                      )}
                    </td>
                  )}
                  <td className="py-4 px-4 text-center align-top">
                    <button
                      className="w-8 h-8 rounded-md flex items-center justify-center text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
                      onClick={(e) => { e.stopPropagation(); onMaterialsClick?.(step) }}
                      title="View materials"
                    >
                      <Package className="h-4 w-4" />
                    </button>
                  </td>
                  <td className="py-4 px-4 text-center align-top">
                    <button
                      className="w-8 h-8 rounded-md flex items-center justify-center text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
                      onClick={(e) => { e.stopPropagation(); onBuffersClick?.(step) }}
                      title="View buffer recipes"
                    >
                      <FlaskConical className="h-4 w-4" />
                    </button>
                  </td>
                  {showCreatedColumn && (
                    <td className="py-4 px-4 align-top">
                      <div className="text-sm text-gray-900">{step.author || "—"}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{step.dateSelected || "—"}</div>
                    </td>
                  )}
                  {!showCreatedColumn && showDateSelected && (
                    <td className="py-4 px-4 align-top">
                      <div className="text-sm text-gray-600">{step.dateSelected || "—"}</div>
                    </td>
                  )}
                  {!showCreatedColumn && showAuthor && (
                    <td className="py-4 px-4 align-top">
                      <div className="text-sm text-gray-600">{step.author || "—"}</div>
                    </td>
                  )}
                  {showStatus && (
                    <td className="py-4 px-4 align-top">
                      {getExecutionStatusBadge(step.executionStatus)}
                    </td>
                  )}
                  {showAction && (
                    <td className="py-4 px-4 text-center">
                      {isCompleted && hasIo ? (
                        // Completed + has I/O → toggle accordion
                        <button
                          onClick={toggleExpand}
                          className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
                            isExpanded
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          )}
                          title={isExpanded ? "Hide I/O" : "Show I/O"}
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          {isExpanded
                            ? <ChevronUp   className="h-3.5 w-3.5" />
                            : <ChevronDown className="h-3.5 w-3.5" />}
                        </button>
                      ) : isCompleted ? (
                        <span className="text-xs text-gray-400 font-medium">Done</span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8"
                          onClick={(e) => { e.stopPropagation(); onRunStep?.(step.id) }}
                          disabled={step.executionStatus === 'running'}
                        >
                          {step.executionStatus === 'running'
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <Play    className="h-4 w-4" />}
                        </Button>
                      )}
                    </td>
                  )}
                  {/* ── Input column ──────────────────────────────────────── */}
                  {onInputClick && (() => {
                    const stepData  = moduleDataMap?.[step.id]
                    const inputData = stepData?.inputData
                    const hasInput  = inputData && (inputData.text?.trim() || inputData.files?.length)
                    return (
                      <td className="py-4 px-4 align-top">
                        {hasInput ? (
                          <div className="flex flex-col gap-1">
                            {stepData?.startedAt && (
                              <p className="text-[10px] text-gray-400">{stepData.startedAt}</p>
                            )}
                            {inputData.text?.trim() && (
                              <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed">{inputData.text}</p>
                            )}
                            {inputData.files?.length > 0 && (
                              <p className="text-xs text-gray-400">📎 {inputData.files.length} file{inputData.files.length !== 1 ? 's' : ''}</p>
                            )}
                            <button
                              className="mt-0.5 inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors"
                              onClick={e => { e.stopPropagation(); onInputClick(step) }}
                            >
                              <Pencil className="h-3 w-3" />
                              Edit
                            </button>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" className="h-7 text-xs"
                            disabled={!prevCompleted}
                            onClick={e => { e.stopPropagation(); onInputClick(step) }}>
                            <LogIn className="h-3.5 w-3.5 mr-1" />
                            Start
                          </Button>
                        )}
                      </td>
                    )
                  })()}

                  {/* ── Output column ─────────────────────────────────────── */}
                  {onOutputClick && (() => {
                    const stepData   = moduleDataMap?.[step.id]
                    const outputData = stepData?.outputData
                    const hasOutput  = outputData && (outputData.text?.trim() || outputData.files?.length)
                    return (
                      <td className="py-4 px-4 align-top">
                        {hasOutput ? (
                          <div className="flex flex-col gap-1">
                            {stepData?.completedAt && (
                              <p className="text-[10px] text-gray-400">{stepData.completedAt}</p>
                            )}
                            {outputData.text?.trim() && (
                              <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed">{outputData.text}</p>
                            )}
                            {outputData.files?.length > 0 && (
                              <p className="text-xs text-gray-400">📎 {outputData.files.length} file{outputData.files.length !== 1 ? 's' : ''}</p>
                            )}
                            <button
                              className="mt-0.5 inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors"
                              onClick={e => { e.stopPropagation(); onOutputClick(step) }}
                            >
                              <Pencil className="h-3 w-3" />
                              Edit
                            </button>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" className="h-7 text-xs"
                            disabled={!prevCompleted}
                            onClick={e => { e.stopPropagation(); onOutputClick(step) }}>
                            <LogOut className="h-3.5 w-3.5 mr-1" />
                            Complete
                          </Button>
                        )}
                      </td>
                    )
                  })()}
                </tr>

                {/* ── Accordion I/O row ─────────────────────────────────── */}
                {isExpanded && hasIo && (
                  <tr key={`${step.id}-io`} className="bg-blue-50 border-b border-blue-100">
                    <td colSpan={totalCols} className="px-6 py-4">
                      <div className="grid grid-cols-2 gap-6 divide-x divide-gray-200">
                        {/* Input */}
                        <div className="pr-6">
                          <IoSection label="Input" data={stepIoData!.inputData} />
                        </div>
                        {/* Output */}
                        <div className="pl-6">
                          <IoSection label="Output" data={stepIoData!.outputData} />
                          {(stepIoData!.outputData.text.trim() || stepIoData!.outputData.files.length > 0) && onEditOutput && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-3 h-7 text-xs"
                              onClick={(e) => { e.stopPropagation(); onEditOutput(step.id) }}
                            >
                              <Pencil className="h-3 w-3 mr-1.5" />
                              Edit Output
                            </Button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
