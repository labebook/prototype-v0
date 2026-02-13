"use client"

import type React from "react"

import { useState } from "react"
import { X, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Modal wrapper component
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>

        {/* Footer */}
        {footer && <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  )
}

// Parameters Modal Component
export function ParametersModal({
  isOpen,
  onClose,
  stepName,
  isEditable,
  onApply,
}: {
  isOpen: boolean
  onClose: () => void
  stepName: string
  isEditable: boolean
  onApply?: (data: any) => void
}) {
  const [selectedPills, setSelectedPills] = useState<Record<string, boolean>>({
    ripa: false,
    "np-40": false,
    custom: false,
    "inhibitor-added": false,
    "450g": false,
    "2500g": false,
    "5min": false,
    "10min": false,
  })

  const togglePill = (pillId: string) => {
    if (!isEditable) return
    setSelectedPills((prev) => ({
      ...prev,
      [pillId]: !prev[pillId],
    }))
  }

  const handleApply = () => {
    if (onApply) {
      onApply(selectedPills)
    }
    onClose()
  }

  const TogglePill = ({ id, label, tooltip }: { id: string; label: string; tooltip: string }) => {
    const isSelected = selectedPills[id]

    return (
      <button
        role="button"
        aria-pressed={isSelected}
        disabled={!isEditable}
        className={cn(
          "flex items-center rounded-full px-2.5 py-0.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-black whitespace-nowrap",
          isSelected ? "bg-black text-white" : "bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB] border border-[#D1D5DB]",
          !isEditable && "cursor-not-allowed opacity-60",
        )}
        onClick={() => togglePill(id)}
      >
        <span className="truncate max-w-[150px]">{label}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="ml-1.5">
                <Info className={cn("h-3.5 w-3.5", isSelected ? "text-white" : "text-gray-500")} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </button>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${stepName} — Parameters`}
      footer={
        isEditable ? (
          <>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleApply} className="bg-black hover:bg-gray-800">
              Apply to Pipeline
            </Button>
          </>
        ) : (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )
      }
    >
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">Lysis Buffer</h3>
          <div className="flex flex-wrap gap-2">
            <TogglePill id="ripa" label="RIPA" tooltip="RIPA buffer is suitable for total protein extraction." />
            <TogglePill id="np-40" label="NP-40" tooltip="NP-40 buffer preserves protein-protein interactions." />
            <TogglePill id="custom" label="Custom" tooltip="Use a custom lysis buffer formulation." />
            <TogglePill
              id="inhibitor-added"
              label="Inhibitor added"
              tooltip="Add protease/phosphatase inhibitor cocktail."
            />
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Centrifugation</h3>
          <div className="flex flex-wrap gap-2">
            <TogglePill id="450g" label="450 ×g" tooltip="Gentle centrifugation for fragile cells." />
            <TogglePill id="2500g" label="2 500 ×g" tooltip="Higher speed for efficient pelleting." />
            <TogglePill id="5min" label="5 min" tooltip="Shorter centrifugation time." />
            <TogglePill id="10min" label="10 min" tooltip="Longer centrifugation for complete pelleting." />
          </div>
        </div>
      </div>
    </Modal>
  )
}

// Protocol Modal Component
export function ProtocolModal({
  isOpen,
  onClose,
  stepName,
  protocolText,
}: {
  isOpen: boolean
  onClose: () => void
  stepName: string
  protocolText: string
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${stepName} — Protocol`}
      footer={
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="prose prose-sm max-w-none">
        <div className="whitespace-pre-wrap text-gray-700">{protocolText}</div>
      </div>
    </Modal>
  )
}

// Buffer Recipes Modal Component
export function BufferRecipesModal({
  isOpen,
  onClose,
  stepName,
  buffers,
}: {
  isOpen: boolean
  onClose: () => void
  stepName: string
  buffers: Array<{ name: string; components: Array<{ component: string; concentration: string; volume: string }> }>
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${stepName} — Buffer Recipes`}
      footer={
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="space-y-6">
        {buffers.map((buffer, index) => (
          <div key={index}>
            <h3 className="font-medium mb-3">{buffer.name}</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Component</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Concentration</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Volume</th>
                </tr>
              </thead>
              <tbody>
                {buffer.components.map((comp, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-2 px-3 text-sm">{comp.component}</td>
                    <td className="py-2 px-3 text-sm">{comp.concentration}</td>
                    <td className="py-2 px-3 text-sm">{comp.volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </Modal>
  )
}

// Calculations Modal Component
export function CalculationsModal({
  isOpen,
  onClose,
  stepName,
  calculations,
}: {
  isOpen: boolean
  onClose: () => void
  stepName: string
  calculations: Array<{ label: string; value: string; description: string }>
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${stepName} — Calculations`}
      footer={
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="space-y-4">
        {calculations.map((calc, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{calc.label}</h3>
              <span className="text-lg font-semibold text-blue-600">{calc.value}</span>
            </div>
            <p className="text-sm text-gray-600">{calc.description}</p>
          </div>
        ))}
      </div>
    </Modal>
  )
}

// Materials Modal Component
export function MaterialsModal({
  isOpen,
  onClose,
  stepName,
  materials,
}: {
  isOpen: boolean
  onClose: () => void
  stepName: string
  materials: { reagents: string[]; consumables: string[]; equipment: string[] }
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${stepName} — Materials`}
      footer={
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">Reagents</h3>
          <ul className="list-disc list-inside space-y-1">
            {materials.reagents.map((item, index) => (
              <li key={index} className="text-sm text-gray-700">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-medium mb-3">Consumables</h3>
          <ul className="list-disc list-inside space-y-1">
            {materials.consumables.map((item, index) => (
              <li key={index} className="text-sm text-gray-700">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-medium mb-3">Equipment</h3>
          <ul className="list-disc list-inside space-y-1">
            {materials.equipment.map((item, index) => (
              <li key={index} className="text-sm text-gray-700">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  )
}

interface ParameterRange {
  id: string
  name: string
  min: number
  max: number
  unit: string
  selectedValue: number
  description: string
  theory: string
  stepNumber: number
  stepName: string
}

const ParameterEditor = ({
  parameter,
  isOpen,
  onClose,
  onSave,
}: {
  parameter: ParameterRange
  isOpen: boolean
  onClose: () => void
  onSave: (value: number) => void
}) => {
  const [value, setValue] = useState(parameter.selectedValue)
  const [error, setError] = useState<string | null>(null)

  const handleSave = () => {
    if (value < parameter.min || value > parameter.max) {
      setError(`Value must be between ${parameter.min} and ${parameter.max} ${parameter.unit}`)
      return
    }
    onSave(value)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{parameter.name}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="parameter-value">Value</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="parameter-value"
                type="number"
                value={value}
                onChange={(e) => {
                  setValue(Number(e.target.value))
                  setError(null)
                }}
                min={parameter.min}
                max={parameter.max}
                step={0.1}
                className="flex-1"
              />
              <span className="text-sm text-gray-500">{parameter.unit}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Range: {parameter.min}–{parameter.max} {parameter.unit}
            </p>
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          </div>

          <div>
            <p className="text-sm text-gray-700">{parameter.description}</p>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900">Theory</p>
                <p className="text-sm text-blue-800">{parameter.theory}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} className="flex-1" disabled={!!error}>
              Save
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function WesternBlotParametersModal({
  isOpen,
  onClose,
  onApply,
}: {
  isOpen: boolean
  onClose: () => void
  onApply?: (parameters: ParameterRange[]) => void
}) {
  const [editingParameter, setEditingParameter] = useState<ParameterRange | null>(null)
  const [parameters, setParameters] = useState<ParameterRange[]>([
    {
      id: "transfer-voltage",
      name: "Transfer Voltage",
      min: 80,
      max: 120,
      unit: "V",
      selectedValue: 100,
      description: "Voltage for wet transfer",
      theory: "Higher voltage speeds transfer but generates more heat",
      stepNumber: 6,
      stepName: "Setting up the Transfer Apparatus",
    },
    {
      id: "transfer-time",
      name: "Transfer Time",
      min: 60,
      max: 120,
      unit: "min",
      selectedValue: 90,
      description: "Duration of protein transfer",
      theory: "Longer times ensure complete transfer of high MW proteins",
      stepNumber: 7,
      stepName: "Transfer Conditions",
    },
    {
      id: "blocking-time",
      name: "Blocking Time",
      min: 30,
      max: 120,
      unit: "min",
      selectedValue: 60,
      description: "Duration of blocking step",
      theory: "Adequate blocking prevents non-specific antibody binding",
      stepNumber: 9,
      stepName: "Blocking",
    },
    {
      id: "primary-ab-dilution",
      name: "Primary Antibody Dilution",
      min: 1000,
      max: 10000,
      unit: "x",
      selectedValue: 1000,
      description: "Dilution factor for primary antibody",
      theory: "Optimal dilution balances signal strength and background",
      stepNumber: 10,
      stepName: "Primary Antibody Incubation",
    },
    {
      id: "wash-cycles",
      name: "Wash Cycles",
      min: 3,
      max: 5,
      unit: "cycles",
      selectedValue: 3,
      description: "Number of washing cycles",
      theory: "More washes reduce background but may decrease signal",
      stepNumber: 11,
      stepName: "Washing",
    },
  ])

  const handleParameterSave = (parameterId: string, value: number) => {
    setParameters((prev) =>
      prev.map((param) => (param.id === parameterId ? { ...param, selectedValue: value } : param)),
    )
  }

  const handleApply = () => {
    if (onApply) {
      onApply(parameters)
    }
    onClose()
  }

  const parametersByStep = parameters.reduce(
    (acc, param) => {
      if (!acc[param.stepNumber]) {
        acc[param.stepNumber] = []
      }
      acc[param.stepNumber].push(param)
      return acc
    },
    {} as Record<number, ParameterRange[]>,
  )

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg w-[800px] max-w-[90vw] max-h-[80vh] overflow-hidden shadow-xl">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Protocol Parameters Summary</h3>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[50vh]">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Step</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Parameter</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Range</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Value</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Explanation</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(parametersByStep).map(([stepNumber, stepParams]) =>
                  stepParams.map((param, index) => (
                    <tr key={param.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        {index === 0 && (
                          <div>
                            <div className="font-medium">Step {stepNumber}</div>
                            <div className="text-gray-500 text-xs">{param.stepName}</div>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">{param.name}</td>
                      <td className="px-4 py-3 text-sm">
                        {param.min}–{param.max} {param.unit}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">
                        {param.selectedValue} {param.unit}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="truncate cursor-help">{param.theory}</div>
                            </TooltipTrigger>
                            <TooltipContent side="left" className="max-w-xs">
                              <p className="text-sm">{param.theory}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" onClick={() => setEditingParameter(param)}>
                          Edit
                        </Button>
                      </td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleApply} className="bg-black hover:bg-gray-800">
              Apply to Pipeline
            </Button>
          </div>
        </div>
      </div>

      {/* Parameter Editor Modal */}
      {editingParameter && (
        <ParameterEditor
          parameter={editingParameter}
          isOpen={!!editingParameter}
          onClose={() => setEditingParameter(null)}
          onSave={(value) => {
            handleParameterSave(editingParameter.id, value)
            setEditingParameter(null)
          }}
        />
      )}
    </>
  )
}

export function WesternBlotMaterialsModal({
  isOpen,
  onClose,
  onApply,
}: {
  isOpen: boolean
  onClose: () => void
  onApply?: () => void
}) {
  const [activeTab, setActiveTab] = useState("buffers")
  const [buffers, setBuffers] = useState([
    {
      id: "transfer-buffer",
      name: "Transfer Buffer (Towbin)",
      mode: "prepare" as "prepare" | "stock" | "purchase",
      purchase: { brand: "", product: "" },
      ingredients: ["tris-base", "glycine", "methanol"],
    },
    {
      id: "tbst",
      name: "TBST (TBS with Tween-20)",
      mode: "prepare" as "prepare" | "stock" | "purchase",
      purchase: { brand: "", product: "" },
      ingredients: ["tbs-10x", "tween-20"],
    },
    {
      id: "blocking-buffer",
      name: "Blocking Buffer (5% Milk)",
      mode: "stock" as "prepare" | "stock" | "purchase",
      purchase: { brand: "", product: "" },
      ingredients: ["milk-powder", "tbst"],
    },
    {
      id: "ecl-substrate",
      name: "ECL Substrate",
      mode: "purchase" as "prepare" | "stock" | "purchase",
      purchase: { brand: "Thermo Fisher", product: "SuperSignal West Pico PLUS" },
      ingredients: [],
    },
  ])

  const [reagents, setReagents] = useState([
    {
      id: "tris-base",
      name: "Tris base",
      qty: 3.03,
      unit: "g",
      brand: "",
      product: "",
      active: true,
      neededFor: ["Transfer Buffer"],
    },
    {
      id: "glycine",
      name: "Glycine",
      qty: 14.4,
      unit: "g",
      brand: "",
      product: "",
      active: true,
      neededFor: ["Transfer Buffer"],
    },
    {
      id: "methanol",
      name: "Methanol",
      qty: 200,
      unit: "mL",
      brand: "",
      product: "",
      active: true,
      neededFor: ["Transfer Buffer"],
    },
    {
      id: "tbs-10x",
      name: "10X TBS",
      qty: 100,
      unit: "mL",
      brand: "",
      product: "",
      active: true,
      neededFor: ["TBST"],
    },
    {
      id: "tween-20",
      name: "Tween-20",
      qty: 1,
      unit: "mL",
      brand: "",
      product: "",
      active: true,
      neededFor: ["TBST"],
    },
    {
      id: "milk-powder",
      name: "Non-fat dry milk",
      qty: 5,
      unit: "g",
      brand: "",
      product: "",
      active: false,
      neededFor: ["Blocking Buffer"],
    },
  ])

  const [supplies, setSupplies] = useState([
    { id: "pipette-tips", name: "Pipette Tips", brand: "", product: "" },
    { id: "gloves", name: "Disposable Gloves", brand: "", product: "" },
    { id: "filter-papers", name: "Filter Papers (Whatman 3MM)", brand: "", product: "" },
  ])

  const [equipment, setEquipment] = useState([
    { id: "transfer-apparatus", name: "Transfer Apparatus", brand: "", product: "" },
    { id: "power-supply", name: "Power Supply", brand: "", product: "" },
    { id: "imaging-system", name: "Imaging System", brand: "", product: "" },
  ])

  const [highlightedReagents, setHighlightedReagents] = useState<string[]>([])

  const brandOptions = [
    "Thermo Fisher",
    "Sigma-Aldrich",
    "Bio-Rad",
    "Merck",
    "GE Healthcare",
    "Abcam",
    "Cell Signaling",
  ]

  const productOptions: Record<string, string[]> = {
    "Thermo Fisher": ["SuperSignal West Pico PLUS", "SuperSignal West Femto", "Pierce ECL Western Blotting Substrate"],
    "Sigma-Aldrich": ["Tris Base (T1503)", "Glycine (G8898)", "Methanol (34860)"],
    "Bio-Rad": ["Clarity Western ECL Substrate", "Immun-Blot PVDF Membrane"],
  }

  const handleBufferModeChange = (bufferId: string, mode: "prepare" | "stock" | "purchase") => {
    setBuffers((prev) => prev.map((b) => (b.id === bufferId ? { ...b, mode } : b)))

    const buffer = buffers.find((b) => b.id === bufferId)
    if (buffer) {
      setReagents((prev) =>
        prev.map((r) => {
          if (buffer.ingredients.includes(r.id)) {
            return { ...r, active: mode === "prepare" }
          }
          return r
        }),
      )
    }
  }

  const handleBufferPurchaseChange = (bufferId: string, field: "brand" | "product", value: string) => {
    setBuffers((prev) =>
      prev.map((b) => (b.id === bufferId ? { ...b, purchase: { ...b.purchase, [field]: value } } : b)),
    )
  }

  const handleReagentChange = (reagentId: string, field: "brand" | "product", value: string) => {
    setReagents((prev) => prev.map((r) => (r.id === reagentId ? { ...r, [field]: value } : r)))
  }

  const handleSupplyChange = (supplyId: string, field: "brand" | "product", value: string) => {
    setSupplies((prev) => prev.map((s) => (s.id === supplyId ? { ...s, [field]: value } : s)))
  }

  const handleEquipmentChange = (equipmentId: string, field: "brand" | "product", value: string) => {
    setEquipment((prev) => prev.map((e) => (e.id === equipmentId ? { ...e, [field]: value } : e)))
  }

  const handleJumpToIngredients = (ingredientIds: string[]) => {
    setActiveTab("reagents")
    setHighlightedReagents(ingredientIds)
    setTimeout(() => setHighlightedReagents([]), 2000)
  }

  const handleReset = () => {
    setBuffers((prev) =>
      prev.map((b) => ({
        ...b,
        mode: "prepare" as "prepare" | "stock" | "purchase",
        purchase: { brand: "", product: "" },
      })),
    )
    setReagents((prev) => prev.map((r) => ({ ...r, brand: "", product: "", active: true })))
    setSupplies((prev) => prev.map((s) => ({ ...s, brand: "", product: "" })))
    setEquipment((prev) => prev.map((e) => ({ ...e, brand: "", product: "" })))
  }

  const handleExportCSV = () => {
    alert("CSV export functionality will be implemented")
  }

  const handleExportPDF = () => {
    alert("PDF export functionality will be implemented")
  }

  const handleApply = () => {
    if (onApply) {
      onApply()
    }
    onClose()
  }

  const purchasingSummary = {
    buffers: buffers.filter((b) => b.mode === "purchase"),
    reagents: reagents.filter((r) => r.active),
    supplies: supplies,
    equipment: equipment,
  }

  const totalPurchaseItems =
    purchasingSummary.buffers.length +
    purchasingSummary.reagents.length +
    purchasingSummary.supplies.length +
    purchasingSummary.equipment.length

  const tabs = [
    { id: "buffers", label: "Buffers & Solutions" },
    { id: "reagents", label: "Reagents" },
    { id: "supplies", label: "Supplies" },
    { id: "equipment", label: "Equipment" },
    { id: "purchasing", label: "Purchasing Summary" },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-[1040px] max-w-[90vw] max-h-[85vh] overflow-hidden shadow-xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-semibold">Western Blot — Materials</h2>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              Export PDF
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 flex-shrink-0">
          <div className="flex px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={cn(
                  "px-4 py-3 text-sm relative",
                  activeTab === tab.id ? "text-gray-900 font-medium" : "text-gray-600 hover:text-gray-900",
                )}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black"></div>}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {activeTab === "buffers" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Select procurement mode for each buffer/solution. Changing the mode updates reagent requirements and
                purchasing summary.
              </p>
              {buffers.map((buffer, index) => (
                <div key={buffer.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium text-gray-500">{index + 1}.</span>
                        <span className="font-medium">{buffer.name}</span>
                        {buffer.mode === "prepare" && buffer.ingredients.length > 0 && (
                          <button
                            onClick={() => handleJumpToIngredients(buffer.ingredients)}
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                          >
                            <Info className="h-3.5 w-3.5" />
                            <span>Ingredients</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`buffer-${buffer.id}`}
                            checked={buffer.mode === "prepare"}
                            onChange={() => handleBufferModeChange(buffer.id, "prepare")}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Prepare fresh</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`buffer-${buffer.id}`}
                            checked={buffer.mode === "stock"}
                            onChange={() => handleBufferModeChange(buffer.id, "stock")}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Use existing stock</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`buffer-${buffer.id}`}
                            checked={buffer.mode === "purchase"}
                            onChange={() => handleBufferModeChange(buffer.id, "purchase")}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Purchase ready-made</span>
                        </label>
                      </div>

                      {buffer.mode === "purchase" && (
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <Label htmlFor={`brand-${buffer.id}`} className="text-xs text-gray-600">
                              Brand
                            </Label>
                            <select
                              id={`brand-${buffer.id}`}
                              value={buffer.purchase.brand}
                              onChange={(e) => handleBufferPurchaseChange(buffer.id, "brand", e.target.value)}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                            >
                              <option value="">Select brand</option>
                              {brandOptions.map((brand) => (
                                <option key={brand} value={brand}>
                                  {brand}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex-1">
                            <Label htmlFor={`product-${buffer.id}`} className="text-xs text-gray-600">
                              Product
                            </Label>
                            <select
                              id={`product-${buffer.id}`}
                              value={buffer.purchase.product}
                              onChange={(e) => handleBufferPurchaseChange(buffer.id, "product", e.target.value)}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                              disabled={!buffer.purchase.brand}
                            >
                              <option value="">Select product</option>
                              {buffer.purchase.brand &&
                                productOptions[buffer.purchase.brand]?.map((product) => (
                                  <option key={product} value={product}>
                                    {product}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "reagents" && (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Chemical components required when linked buffers/solutions are marked "Prepare fresh".
              </p>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">#</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Reagent</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Needed for</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Qty/Units</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Brand</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Product</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reagents
                      .filter((r) => r.active)
                      .map((reagent, index) => (
                        <tr
                          key={reagent.id}
                          className={cn(
                            "border-b border-gray-100 transition-colors",
                            highlightedReagents.includes(reagent.id) ? "bg-yellow-50" : "hover:bg-gray-50",
                          )}
                        >
                          <td className="px-4 py-3 text-sm">{index + 1}</td>
                          <td className="px-4 py-3 text-sm font-medium">{reagent.name}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">
                              {reagent.neededFor.join(", ")}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {reagent.qty} {reagent.unit}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={reagent.brand}
                              onChange={(e) => handleReagentChange(reagent.id, "brand", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            >
                              <option value="">Select brand</option>
                              {brandOptions.map((brand) => (
                                <option key={brand} value={brand}>
                                  {brand}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={reagent.product}
                              onChange={(e) => handleReagentChange(reagent.id, "product", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              disabled={!reagent.brand}
                            >
                              <option value="">Select product</option>
                              {reagent.brand &&
                                productOptions[reagent.brand]?.map((product) => (
                                  <option key={product} value={product}>
                                    {product}
                                  </option>
                                ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "supplies" && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">#</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Supply</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Brand</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Product</th>
                  </tr>
                </thead>
                <tbody>
                  {supplies.map((supply, index) => (
                    <tr key={supply.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{index + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium">{supply.name}</td>
                      <td className="px-4 py-3">
                        <select
                          value={supply.brand}
                          onChange={(e) => handleSupplyChange(supply.id, "brand", e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="">Select brand</option>
                          {brandOptions.map((brand) => (
                            <option key={brand} value={brand}>
                              {brand}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={supply.product}
                          onChange={(e) => handleSupplyChange(supply.id, "product", e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          disabled={!supply.brand}
                        >
                          <option value="">Select product</option>
                          {supply.brand &&
                            productOptions[supply.brand]?.map((product) => (
                              <option key={product} value={product}>
                                {product}
                              </option>
                            ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "equipment" && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">#</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Equipment</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Brand</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Product</th>
                  </tr>
                </thead>
                <tbody>
                  {equipment.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{index + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                      <td className="px-4 py-3">
                        <select
                          value={item.brand}
                          onChange={(e) => handleEquipmentChange(item.id, "brand", e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="">Select brand</option>
                          {brandOptions.map((brand) => (
                            <option key={brand} value={brand}>
                              {brand}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={item.product}
                          onChange={(e) => handleEquipmentChange(item.id, "product", e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          disabled={!item.brand}
                        >
                          <option value="">Select product</option>
                          {item.brand &&
                            productOptions[item.brand]?.map((product) => (
                              <option key={product} value={product}>
                                {product}
                              </option>
                            ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "purchasing" && (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Auto-generated list of items that must be purchased given current choices. Total items:{" "}
                {totalPurchaseItems}
              </p>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Brand</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Product/SKU</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchasingSummary.buffers.map((buffer) => (
                      <tr key={buffer.id} className="border-b border-gray-100">
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-purple-50 text-purple-700">
                            Buffer
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">{buffer.name}</td>
                        <td className="px-4 py-3 text-sm">{buffer.purchase.brand || "—"}</td>
                        <td className="px-4 py-3 text-sm">{buffer.purchase.product || "—"}</td>
                      </tr>
                    ))}
                    {purchasingSummary.reagents.map((reagent) => (
                      <tr key={reagent.id} className="border-b border-gray-100">
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">
                            Reagent
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">{reagent.name}</td>
                        <td className="px-4 py-3 text-sm">{reagent.brand || "—"}</td>
                        <td className="px-4 py-3 text-sm">{reagent.product || "—"}</td>
                      </tr>
                    ))}
                    {purchasingSummary.supplies.map((supply) => (
                      <tr key={supply.id} className="border-b border-gray-100">
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-700">
                            Supply
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">{supply.name}</td>
                        <td className="px-4 py-3 text-sm">{supply.brand || "—"}</td>
                        <td className="px-4 py-3 text-sm">{supply.product || "—"}</td>
                      </tr>
                    ))}
                    {purchasingSummary.equipment.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-orange-50 text-orange-700">
                            Equipment
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                        <td className="px-4 py-3 text-sm">{item.brand || "—"}</td>
                        <td className="px-4 py-3 text-sm">{item.product || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleApply} className="bg-black hover:bg-gray-800">
            Apply to Pipeline
          </Button>
        </div>
      </div>
    </div>
  )
}
