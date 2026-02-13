"use client"
import { Grid3X3, FlaskConical, Package, Filter, Play, CheckCircle, XCircle, Circle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PipelineStep {
  step: number
  name: string
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

interface PipelineListViewProps {
  steps: PipelineStep[]
  onParametersClick?: (step: PipelineStep) => void
  onProtocolClick?: (step: PipelineStep) => void
  onBuffersClick?: (step: PipelineStep) => void
  onCalculationsClick?: (step: PipelineStep) => void
  onMaterialsClick?: (step: PipelineStep) => void
  onPlanClick?: (step: PipelineStep) => void
  onRunStep?: (stepId: string) => void
  completedModules?: Set<string>
  updatedStepId?: string | null
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
  completedModules,
  updatedStepId,
}: PipelineListViewProps) {
  // Add null/undefined check
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
    if (!step.protocolId) {
      return "text-gray-400 bg-gray-100" // Grey - no protocol selected
    }
    if (step.parametersState === "selected") {
      return "text-orange-600 bg-orange-100" // Orange - protocol selected but parameters not set
    }
    if (step.parametersState === "configured") {
      return "text-green-600 bg-green-100" // Green - protocol selected and parameters set
    }
    return "text-gray-400 bg-gray-100" // Default grey
  }

  const getExecutionStatusBadge = (status?: 'idle' | 'running' | 'completed' | 'failed') => {
    if (!status || status === 'idle') {
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
          <Circle className="mr-1 h-3 w-3" />
          Idle
        </Badge>
      )
    }
    if (status === 'running') {
      return (
        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          Running
        </Badge>
      )
    }
    if (status === 'completed') {
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200">
          <CheckCircle className="mr-1 h-3 w-3" />
          Completed
        </Badge>
      )
    }
    if (status === 'failed') {
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200">
          <XCircle className="mr-1 h-3 w-3" />
          Failed
        </Badge>
      )
    }
    return null
  }

  const getStepWithMockData = (step: PipelineStep, index: number) => {
    // If the step already has a protocolId, keep it instead of overriding with mock data
    if (step.protocolId) {
      return {
        ...step,
        parametersState: step.parametersState || ("none" as const),
        dateSelected: step.dateSelected || undefined,
        author: step.author || undefined,
      }
    }

    // Simulate different readiness states for demonstration (only for steps without protocolId)
    if (index === 0) {
      // State 1: Method only
      return {
        ...step,
        protocolId: undefined,
        parametersState: "none" as const,
        dateSelected: undefined,
        author: undefined,
      }
    } else if (index === 1) {
      // State 2: Method + Protocol
      return {
        ...step,
        protocolId: "#202",
        parametersState: "selected" as const,
        dateSelected: "2025-03-15",
        author: "Dr. Smith",
      }
    } else if (index === 2) {
      // State 3: Method + Protocol + Parameters
      return {
        ...step,
        protocolId: "#305",
        parametersState: "configured" as const,
        dateSelected: "2025-03-18",
        author: "Dr. Johnson",
      }
    } else {
      // Mix of states for other steps
      return {
        ...step,
        protocolId: index % 2 === 0 ? `#${300 + index}` : undefined,
        parametersState: index % 3 === 0 ? "configured" : ((index % 2 === 0 ? "selected" : "none") as const),
        dateSelected: index % 2 === 0 ? "2025-03-20" : undefined,
        author: index % 2 === 0 ? "Current User" : undefined,
      }
    }
  }

  if (steps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
        <h2 className="text-lg font-semibold text-gray-700">No steps yet</h2>
        <p className="text-sm text-gray-500">
          Switch back to <strong>Visual</strong> view or use the left sidebar to add methods.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full h-full overflow-auto">
      <table className="w-full border-collapse" role="table">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="w-[250px] py-3 px-4 text-left text-sm font-medium text-gray-500">Method Name</th>
            <th className="w-[80px] py-3 px-4 text-center text-sm font-medium text-gray-500">Plan</th>
            <th className="w-[80px] py-3 px-4 text-center text-sm font-medium text-gray-500">Parameters</th>
            <th className="w-[100px] py-3 px-4 text-left text-sm font-medium text-gray-500">Protocol ID</th>
            <th className="w-[80px] py-3 px-4 text-center text-sm font-medium text-gray-500">Materials</th>
            <th className="w-[80px] py-3 px-4 text-center text-sm font-medium text-gray-500">Buffer Recipes</th>
            <th className="w-[120px] py-3 px-4 text-left text-sm font-medium text-gray-500">Date Selected</th>
            <th className="w-[120px] py-3 px-4 text-left text-sm font-medium text-gray-500">Author</th>
            <th className="w-[130px] py-3 px-4 text-left text-sm font-medium text-gray-500">Status</th>
            <th className="w-[100px] py-3 px-4 text-center text-sm font-medium text-gray-500">Action</th>
          </tr>
        </thead>
        <tbody>
          {steps.map((originalStep, index) => {
            const step = getStepWithMockData(originalStep, index)
            const isCompleted = completedModules?.has(step.id) || step.executionStatus === 'completed'
            return (
              <tr
                key={step.id}
                className={cn(
                  "border-b border-gray-200 transition-colors",
                  isCompleted ? "bg-gray-100 opacity-60" : "hover:bg-gray-50",
                  updatedStepId === step.id ? "bg-green-50 hover:bg-green-50" : "",
                )}
              >
                <td className="py-4 px-4">
                  <div className="text-sm font-medium text-gray-900">{step.name}</div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="flex items-center justify-center">
                    <button
                      className="w-8 h-8 rounded-md flex items-center justify-center text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        onPlanClick?.(step)
                      }}
                      title="Configure module filters"
                    >
                      <Filter className="h-4 w-4" />
                    </button>
                    {updatedStepId === step.id && (
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        Updated
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <button
                    className={cn(
                      "w-8 h-8 rounded-md flex items-center justify-center transition-colors cursor-pointer",
                      getParametersButtonColor(step),
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      onParametersClick?.(step)
                    }}
                    title="Configure parameters"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                </td>
                <td className="py-4 px-4">
                  {step.protocolId === "CM-001" ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onProtocolClick?.(step)
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium"
                    >
                      {step.protocolId}
                    </button>
                  ) : (
                    <div className="text-sm text-gray-600">{step.protocolId || "—"}</div>
                  )}
                </td>
                <td className="py-4 px-4 text-center">
                  <button
                    className="w-8 h-8 rounded-md flex items-center justify-center text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      onMaterialsClick?.(step)
                    }}
                    title="View materials"
                  >
                    <Package className="h-4 w-4" />
                  </button>
                </td>
                <td className="py-4 px-4 text-center">
                  <button
                    className="w-8 h-8 rounded-md flex items-center justify-center text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      onBuffersClick?.(step)
                    }}
                    title="View buffer recipes"
                  >
                    <FlaskConical className="h-4 w-4" />
                  </button>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-gray-600">{step.dateSelected || "—"}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-gray-600">{step.author || "—"}</div>
                </td>
                <td className="py-4 px-4">
                  {getExecutionStatusBadge(step.executionStatus)}
                </td>
                <td className="py-4 px-4 text-center">
                  {isCompleted ? (
                    <span className="text-xs text-gray-500 font-medium">Completed</span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRunStep?.(step.id)
                      }}
                      disabled={step.executionStatus === 'running'}
                    >
                      {step.executionStatus === 'running' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
