"use client"

import { useState, useEffect } from "react"
import { Download, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ParameterValue {
  id: string
  value: number
  min: number
  max: number
  unit: string
  label: string
  description: string
}

interface CustomModuleProtocolOverlayProps {
  isOpen: boolean
  onClose: () => void
  onSave: (parameters: Record<string, number>) => void
  initialParameters?: Record<string, number>
}

export function CustomModuleProtocolOverlay({
  isOpen,
  onClose,
  onSave,
  initialParameters = {},
}: CustomModuleProtocolOverlayProps) {
  const [parameters, setParameters] = useState<Record<string, ParameterValue>>({
    "centrifuge-speed-harvest": {
      id: "centrifuge-speed-harvest",
      value: initialParameters["centrifuge-speed-harvest"] || 400,
      min: 300,
      max: 500,
      unit: "×g",
      label: "Centrifugation Speed (Harvest)",
      description: "Speed for pelleting suspension cells during harvesting",
    },
    "centrifuge-time-harvest": {
      id: "centrifuge-time-harvest",
      value: initialParameters["centrifuge-time-harvest"] || 5,
      min: 1,
      max: 15,
      unit: "min",
      label: "Centrifugation Time (Harvest)",
      description: "Duration of centrifugation during harvesting",
    },
    "centrifuge-temp-harvest": {
      id: "centrifuge-temp-harvest",
      value: initialParameters["centrifuge-temp-harvest"] || 4,
      min: 0,
      max: 4,
      unit: "°C",
      label: "Temperature (Harvest)",
      description: "Temperature during centrifugation",
    },
    "centrifuge-speed-wash": {
      id: "centrifuge-speed-wash",
      value: initialParameters["centrifuge-speed-wash"] || 400,
      min: 300,
      max: 500,
      unit: "×g",
      label: "Centrifugation Speed (Wash)",
      description: "Speed for pelleting during wash step",
    },
    "centrifuge-time-wash": {
      id: "centrifuge-time-wash",
      value: initialParameters["centrifuge-time-wash"] || 5,
      min: 1,
      max: 15,
      unit: "min",
      label: "Centrifugation Time (Wash)",
      description: "Duration of wash centrifugation",
    },
    "centrifuge-temp-wash": {
      id: "centrifuge-temp-wash",
      value: initialParameters["centrifuge-temp-wash"] || 4,
      min: 0,
      max: 4,
      unit: "°C",
      label: "Temperature (Wash)",
      description: "Temperature during wash",
    },
    "buffer-volume": {
      id: "buffer-volume",
      value: initialParameters["buffer-volume"] || 1,
      min: 0.5,
      max: 5,
      unit: "mL",
      label: "Buffer Volume",
      description: "Volume of lysis buffer per pellet",
    },
    "cell-count": {
      id: "cell-count",
      value: initialParameters["cell-count"] || 10,
      min: 0.5,
      max: 50,
      unit: "×10⁷",
      label: "Cell Count",
      description: "Number of cells (in millions)",
    },
    "lysis-time": {
      id: "lysis-time",
      value: initialParameters["lysis-time"] || 10,
      min: 5,
      max: 15,
      unit: "min",
      label: "Lysis Time",
      description: "Duration of lysis on ice",
    },
    "dnase-units": {
      id: "dnase-units",
      value: initialParameters["dnase-units"] || 10,
      min: 5,
      max: 50,
      unit: "U",
      label: "DNase Units",
      description: "Units of DNase I to add",
    },
    "dnase-time": {
      id: "dnase-time",
      value: initialParameters["dnase-time"] || 7,
      min: 5,
      max: 10,
      unit: "min",
      label: "DNase Incubation Time",
      description: "Duration of DNase treatment",
    },
    "clarification-speed": {
      id: "clarification-speed",
      value: initialParameters["clarification-speed"] || 9000,
      min: 8000,
      max: 10000,
      unit: "×g",
      label: "Clarification Speed",
      description: "Speed for debris removal",
    },
    "clarification-time": {
      id: "clarification-time",
      value: initialParameters["clarification-time"] || 10,
      min: 10,
      max: 15,
      unit: "min",
      label: "Clarification Time",
      description: "Duration of clarification centrifugation",
    },
    "clarification-temp": {
      id: "clarification-temp",
      value: initialParameters["clarification-temp"] || 4,
      min: 0,
      max: 4,
      unit: "°C",
      label: "Temperature (Clarification)",
      description: "Temperature during clarification",
    },
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  const handleParameterChange = (id: string, value: string) => {
    const numValue = Number.parseFloat(value)
    const param = parameters[id]

    if (isNaN(numValue)) {
      setErrors((prev) => ({ ...prev, [id]: "Please enter a valid number" }))
      return
    }

    if (numValue < param.min || numValue > param.max) {
      setErrors((prev) => ({
        ...prev,
        [id]: `Value must be between ${param.min} and ${param.max} ${param.unit}`,
      }))
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[id]
        return newErrors
      })
    }

    setParameters((prev) => ({
      ...prev,
      [id]: { ...prev[id], value: numValue },
    }))
  }

  const handleSave = () => {
    if (Object.keys(errors).length > 0) {
      return
    }

    const parameterValues = Object.entries(parameters).reduce(
      (acc, [key, param]) => {
        acc[key] = param.value
        return acc
      },
      {} as Record<string, number>,
    )

    onSave(parameterValues)
    onClose()
  }

  const EditableParam = ({ paramId }: { paramId: string }) => {
    const param = parameters[paramId]
    const hasError = !!errors[paramId]

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 border rounded text-sm font-medium cursor-help",
                hasError ? "bg-red-50 border-red-300 text-red-800" : "bg-blue-50 border-blue-200 text-blue-800",
              )}
            >
              {param.value} {param.unit}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p className="text-sm font-medium">{param.label}</p>
            <p className="text-xs text-gray-500 mt-1">
              Range: {param.min}–{param.max} {param.unit}
            </p>
            <p className="text-xs mt-1">{param.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="bg-white rounded-lg w-[1000px] max-w-[90vw] max-h-[85vh] flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold uppercase leading-tight">
                Whole-Cell Protein Lysate Preparation Using Detergent-Based Buffer — Protocol (CM-001)
              </h2>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button variant="outline" size="sm" onClick={onClose} className="bg-transparent">
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={Object.keys(errors).length > 0}
                className="bg-black hover:bg-gray-800"
              >
                Save
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {/* Sample Preparation */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Sample Preparation</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">1. Cell Harvesting</h4>
                  <p className="text-gray-700">Transfer the suspension culture into a pre-chilled tube.</p>
                  <p className="text-gray-700">
                    Centrifuge <EditableParam paramId="centrifuge-speed-harvest" /> for{" "}
                    <EditableParam paramId="centrifuge-time-harvest" /> at{" "}
                    <EditableParam paramId="centrifuge-temp-harvest" />.
                  </p>
                  <p className="text-gray-700">Carefully discard the supernatant.</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">2. Wash Cells (Pre-lysis)</h4>
                  <p className="text-gray-700">
                    Add cold PBS, gently resuspend, centrifuge <EditableParam paramId="centrifuge-speed-wash" /> for{" "}
                    <EditableParam paramId="centrifuge-time-wash" /> at <EditableParam paramId="centrifuge-temp-wash" />
                    .
                  </p>
                  <p className="text-gray-700">Remove the supernatant completely.</p>
                </div>
              </div>
            </div>

            {/* Lysis Buffer Preparation */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Lysis Buffer Preparation</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">3. Preparation of Base Buffer (RIPA)</h4>
                  <p className="text-gray-700">
                    Prepare RIPA buffer (e.g., 50 mM Tris-HCl pH 7.4, 150 mM NaCl, 1% NP-40, 0.5% deoxycholate, 0.1%
                    SDS).
                  </p>
                  <p className="text-gray-700">Keep on ice.</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">4. Add Protease Inhibitors</h4>
                  <p className="text-gray-700">Add protease inhibitor cocktail to 1× final concentration.</p>
                  <p className="text-gray-700">Mix gently and keep on ice.</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">5. Work on Ice / Pre-chilled Buffers</h4>
                  <p className="text-gray-700">All solutions and handling at 0–4 °C to minimize protein degradation.</p>
                </div>
              </div>
            </div>

            {/* Principal Work */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Principal Work</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">6. Lysis (Chemical only)</h4>
                  <p className="text-gray-700">
                    Add cold RIPA to the pellet (~ <EditableParam paramId="buffer-volume" /> per{" "}
                    <EditableParam paramId="cell-count" />
                    ).
                  </p>
                  <p className="text-gray-700">
                    Resuspend thoroughly; incubate on ice <EditableParam paramId="lysis-time" />, mixing occasionally.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">7. DNase Treatment (viscosity control)</h4>
                  <p className="text-gray-700">
                    Add DNase I (<EditableParam paramId="dnase-units" />) (with MgCl₂ if needed).
                  </p>
                  <p className="text-gray-700">
                    Incubate on ice <EditableParam paramId="dnase-time" />; mix gently.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">8. Clarification — Pre-cleared (low-speed)</h4>
                  <p className="text-gray-700">
                    Centrifuge <EditableParam paramId="clarification-speed" /> for{" "}
                    <EditableParam paramId="clarification-time" /> at <EditableParam paramId="clarification-temp" />.
                  </p>
                  <p className="text-gray-700">A debris pellet forms.</p>
                  <p className="text-gray-700 font-medium mt-2">Collect Supernatant</p>
                  <p className="text-gray-700">
                    Transfer the supernatant to a new pre-chilled tube without disturbing the pellet. This is the
                    whole-cell protein lysate.
                  </p>
                </div>
              </div>
            </div>

            {/* Storage */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Storage</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">9. Snap-freeze</h4>
                  <p className="text-gray-700">Store samples at −80 °C.</p>
                </div>
              </div>
            </div>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-900">Please fix the following errors:</p>
                  <ul className="mt-2 space-y-1">
                    {Object.entries(errors).map(([id, error]) => (
                      <li key={id} className="text-sm text-red-800">
                        • {parameters[id].label}: {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
