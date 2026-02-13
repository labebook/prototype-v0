"use client"

import type React from "react"
import { useState, useId } from "react"
import { Download, Pencil, Info, Settings, X, BookOpen, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

interface TheoryHint {
  id: string
  stepNumber: number
  type: "info" | "critical"
  content: React.ReactNode
}

interface Recipe {
  id: string
  title: string
  visible: boolean
}

interface Ingredient {
  name: string
  amount: number
  unit: string
  molarMass?: number
  isVolume?: boolean
}

interface EnhancedBufferRecipeSectionProps {
  id: string
  title: string
  visible: boolean
  defaultVolume: number
  ingredients: Ingredient[]
  instructions: string[]
}

const EnhancedBufferRecipeSection = ({
  id,
  title,
  visible,
  defaultVolume,
  ingredients,
  instructions,
}: EnhancedBufferRecipeSectionProps) => {
  const [volume, setVolume] = useState(defaultVolume)

  if (!visible) return null

  const scaleFactor = volume / defaultVolume

  const renderIngredient = (ingredient: Ingredient, scaleFactor: number) => {
    const scaledAmount = (ingredient.amount * scaleFactor).toFixed(2)

    return (
      <div
        key={ingredient.name}
        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
      >
        <div className="flex-1">
          <span className="font-medium">– {ingredient.name}</span>
        </div>
        <div className="font-mono text-sm">
          <span className="font-semibold">
            {scaledAmount} {ingredient.unit}
          </span>
          {scaleFactor !== 1 && (
            <span className="text-xs text-gray-500 ml-2">
              (orig: {ingredient.amount.toFixed(2)} {ingredient.unit})
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Final Volume:</label>
          <input
            type="number"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center"
            min="1"
            step="0.1"
          />
          <span className="text-sm text-gray-600">mL</span>
          {scaleFactor !== 1 && (
            <span className="text-xs text-blue-600 font-medium">({scaleFactor.toFixed(2)}x scale)</span>
          )}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="space-y-1">{ingredients.map((ingredient) => renderIngredient(ingredient, scaleFactor))}</div>
      </div>

      <div className="mt-4 space-y-2">
        {instructions.map((instruction, index) => (
          <p key={index} className="text-sm text-gray-700">
            {instruction.replace(/final volume/g, `${volume} mL`)}
          </p>
        ))}
      </div>
    </div>
  )
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

  const handleSave = () => {
    if (value >= parameter.min && value <= parameter.max) {
      onSave(value)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                onChange={(e) => setValue(Number(e.target.value))}
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
            <Button onClick={handleSave} className="flex-1">
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

const ParameterSummaryTable = ({
  parameters,
  isOpen,
  onClose,
  onParameterEdit,
}: {
  parameters: ParameterRange[]
  isOpen: boolean
  onClose: () => void
  onParameterEdit: (parameter: ParameterRange) => void
}) => {
  if (!isOpen) return null

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[800px] max-w-[90vw] max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Module Parameters Summary</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
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
                      <Button variant="ghost" size="sm" onClick={() => onParameterEdit(param)}>
                        Edit
                      </Button>
                    </td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const EditableParameter = ({
  parameter,
  onEdit,
}: {
  parameter: ParameterRange
  onEdit: (parameter: ParameterRange) => void
}) => {
  return (
    <button
      onClick={() => onEdit(parameter)}
      className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded text-blue-800 font-medium transition-colors text-sm"
    >
      <span>
        {parameter.selectedValue} {parameter.unit}
      </span>
      <Settings className="h-3 w-3" />
    </button>
  )
}

interface StepReference {
  id: string
  stepNumber: number
  citations: {
    authors: string
    year: number
    title: string
    journal: string
    doi?: string
    url?: string
  }[]
}

export default function ModuleExampleProtocolPage({ params }: { params: { slug: string } }) {
  const [activeTab, setActiveTab] = useState("general-protocol")
  const [showTheoryHints, setShowTheoryHints] = useState(true)
  const [showReferences, setShowReferences] = useState(false)
  const [expandedReferences, setExpandedReferences] = useState<number[]>([])
  const [showParameterSummary, setShowParameterSummary] = useState(false)
  const [editingParameter, setEditingParameter] = useState<ParameterRange | null>(null)
  const uniqueId = useId()

  const [parameters, setParameters] = useState<ParameterRange[]>([
    {
      id: "centrifuge-speed-harvest",
      name: "Centrifugation Speed",
      min: 300,
      max: 500,
      unit: "×g",
      selectedValue: 400,
      description: "Speed for pelleting suspension cells during harvesting",
      theory: "Gentle centrifugation preserves cell integrity and prevents premature lysis",
      stepNumber: 1,
      stepName: "Cell Harvesting",
    },
    {
      id: "centrifuge-time-harvest",
      name: "Centrifugation Time",
      min: 5,
      max: 10,
      unit: "min",
      selectedValue: 5,
      description: "Duration of centrifugation during harvesting",
      theory: "Sufficient time ensures complete pelleting without over-stressing cells",
      stepNumber: 1,
      stepName: "Cell Harvesting",
    },
    {
      id: "centrifuge-speed-wash",
      name: "Centrifugation Speed",
      min: 300,
      max: 500,
      unit: "×g",
      selectedValue: 400,
      description: "Speed for pelleting during wash step",
      theory: "Consistent gentle speed maintains cell viability throughout washing",
      stepNumber: 2,
      stepName: "Wash Cells (Pre-lysis)",
    },
    {
      id: "lysis-time",
      name: "Lysis Time",
      min: 5,
      max: 15,
      unit: "min",
      selectedValue: 10,
      description: "Duration of lysis on ice",
      theory: "Longer lysis times ensure complete protein extraction while maintaining protein integrity",
      stepNumber: 6,
      stepName: "Lysis (Chemical only)",
    },
    {
      id: "dnase-incubation",
      name: "DNase Incubation Time",
      min: 5,
      max: 10,
      unit: "min",
      selectedValue: 7,
      description: "Duration of DNase treatment",
      theory: "DNase reduces viscosity by digesting nucleic acids, facilitating pipetting",
      stepNumber: 7,
      stepName: "DNase Treatment",
    },
    {
      id: "clarification-speed",
      name: "Clarification Speed",
      min: 8000,
      max: 10000,
      unit: "×g",
      selectedValue: 9000,
      description: "Speed for debris removal",
      theory: "Low-speed clarification removes cellular debris without losing soluble proteins",
      stepNumber: 8,
      stepName: "Clarification",
    },
    {
      id: "clarification-time",
      name: "Clarification Time",
      min: 10,
      max: 15,
      unit: "min",
      selectedValue: 10,
      description: "Duration of clarification centrifugation",
      theory: "Sufficient time ensures complete debris removal for clean lysate",
      stepNumber: 8,
      stepName: "Clarification",
    },
  ])

  const theoryHints: TheoryHint[] = [
    {
      id: "hint-1",
      stepNumber: 1,
      type: "info",
      content: "Gentle centrifugation preserves cell integrity and prevents premature lysis.",
    },
    {
      id: "hint-2",
      stepNumber: 2,
      type: "info",
      content: "Washing removes serum proteins and residual media components that can interfere with detergent lysis.",
    },
    {
      id: "hint-3",
      stepNumber: 3,
      type: "info",
      content: "RIPA provides broad lysis capacity suitable for most mammalian cell types.",
    },
    {
      id: "hint-4",
      stepNumber: 4,
      type: "critical",
      content: "Protease inhibitors prevent degradation of target proteins during extraction.",
    },
    {
      id: "hint-5",
      stepNumber: 5,
      type: "info",
      content: "Low temperature slows down enzymatic activity that causes unwanted proteolysis.",
    },
    {
      id: "hint-6",
      stepNumber: 6,
      type: "info",
      content: "Gentle agitation ensures complete lysis and uniform extraction of cytosolic and membrane proteins.",
    },
    {
      id: "hint-7",
      stepNumber: 7,
      type: "info",
      content: "DNase reduces viscosity by digesting nucleic acids, facilitating pipetting and downstream handling.",
    },
    {
      id: "hint-8",
      stepNumber: 8,
      type: "info",
      content: "Low-speed clarification removes cellular debris without losing soluble proteins.",
    },
    {
      id: "hint-9",
      stepNumber: 9,
      type: "info",
      content: "Freezing preserves protein integrity and allows repeated use without degradation.",
    },
  ]

  const tabs = [
    { id: "general-protocol", label: "Protocol" },
    { id: "buffer-recipes", label: "Buffer Recipes" },
    { id: "materials-list", label: "Materials List" },
  ]

  const recipesList = [
    { id: "ripa-buffer", title: "RIPA Lysis Buffer" },
    { id: "np40-buffer", title: "NP-40 Lysis Buffer" },
    { id: "pbs", title: "PBS (Phosphate-Buffered Saline)" },
    { id: "tbs", title: "TBS (Tris-Buffered Saline)" },
  ]

  const [recipes, setRecipes] = useState<Recipe[]>(recipesList.map((recipe) => ({ ...recipe, visible: true })))

  const toggleRecipeVisibility = (recipeId: string) => {
    setRecipes((prev) =>
      prev.map((recipe) => (recipe.id === recipeId ? { ...recipe, visible: !recipe.visible } : recipe)),
    )
  }

  const handleParameterSave = (parameterId: string, value: number) => {
    setParameters((prev) =>
      prev.map((param) => (param.id === parameterId ? { ...param, selectedValue: value } : param)),
    )
  }

  const getTheoryHintByStep = (stepNumber: number) => {
    return theoryHints.filter((hint) => hint.stepNumber === stepNumber)
  }

  const stepReferences: StepReference[] = [
    {
      id: "ref-1",
      stepNumber: 1,
      citations: [
        {
          authors: "Harlow, E., & Lane, D.",
          year: 1988,
          title: "Antibodies: A Laboratory Manual",
          journal: "Cold Spring Harbor Laboratory Press",
        },
      ],
    },
    {
      id: "ref-4",
      stepNumber: 4,
      citations: [
        {
          authors: "Mahmood & Yang",
          year: 2012,
          title: "Western blot: technique, theory, and trouble shooting",
          journal: "N Am J Med Sci",
          doi: "10.4103/1947-2714.100998",
        },
      ],
    },
    {
      id: "ref-6",
      stepNumber: 6,
      citations: [
        {
          authors: "Sambrook, J., & Russell, D.W.",
          year: 2001,
          title: "Molecular Cloning: A Laboratory Manual",
          journal: "Cold Spring Harbor Laboratory Press",
        },
      ],
    },
    {
      id: "ref-8",
      stepNumber: 8,
      citations: [
        {
          authors: "Kurien & Scofield",
          year: 2006,
          title: "Western blotting",
          journal: "Methods",
          doi: "10.1016/j.ymeth.2005.11.007",
        },
      ],
    },
  ]

  const getReferencesByStep = (stepNumber: number) => {
    return stepReferences.find((ref) => ref.stepNumber === stepNumber)
  }

  const toggleReferenceExpansion = (stepNumber: number) => {
    setExpandedReferences((prev) =>
      prev.includes(stepNumber) ? prev.filter((n) => n !== stepNumber) : [...prev, stepNumber],
    )
  }

  const StepHeading = ({ number, children }: { number: number; children: React.ReactNode }) => {
    const theoryHintsForStep = getTheoryHintByStep(number)
    const referencesForStep = getReferencesByStep(number)
    const isReferenceExpanded = expandedReferences.includes(number)

    return (
      <div className="relative">
        <div className="flex items-start">
          {showTheoryHints && theoryHintsForStep.length > 0 && (
            <div className="absolute -left-12 top-1 flex flex-col gap-1">
              {theoryHintsForStep.map((hint) => (
                <TooltipProvider key={hint.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {hint.type === "critical" ? (
                        <div className="w-5 h-5 bg-red-100 border border-red-300 rounded-full flex items-center justify-center cursor-help">
                          <span className="text-red-600 text-xs font-bold">!</span>
                        </div>
                      ) : (
                        <div className="w-5 h-5 bg-blue-100 border border-blue-300 rounded-full flex items-center justify-center cursor-help">
                          <Info className="h-3 w-3 text-blue-600" />
                        </div>
                      )}
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-md">
                      <div className="text-sm">{hint.content}</div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          )}

          <h3 className="text-lg font-medium mb-2 flex items-center">
            <span className="inline-flex items-center relative">
              <span className="absolute right-full mr-1 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center">
                <Pencil className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer opacity-0 hover:opacity-100 transition-opacity" />
              </span>
              {number}.
            </span>{" "}
            {children}
            {showReferences && referencesForStep && (
              <button
                onClick={() => toggleReferenceExpansion(number)}
                className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-gray-700 text-xs font-medium transition-colors"
              >
                <BookOpen className="h-3 w-3" />
                <span>Ref</span>
                {isReferenceExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            )}
          </h3>
        </div>

        {showReferences && referencesForStep && isReferenceExpanded && (
          <div className="mt-3 mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">References:</h4>
            <div className="space-y-2">
              {referencesForStep.citations.map((citation, index) => (
                <div key={index} className="text-sm text-gray-600">
                  <p>
                    {citation.authors} ({citation.year}). <em>{citation.title}</em>. {citation.journal}.
                    {citation.doi && (
                      <>
                        {" "}
                        <a
                          href={`https://doi.org/${citation.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          DOI: {citation.doi}
                        </a>
                      </>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const RecipeCheckbox = ({
    id,
    title,
    checked,
    onCheckedChange,
  }: {
    id: string
    title: string
    checked: boolean
    onCheckedChange: (checked: boolean) => void
  }) => {
    const sectionId = `recipe-${id}-${uniqueId}`

    return (
      <div className="flex items-start space-x-2 py-1.5">
        <Checkbox
          id={`checkbox-${id}-${uniqueId}`}
          checked={checked}
          onCheckedChange={onCheckedChange}
          aria-controls={sectionId}
          className="mt-0.5 flex-shrink-0"
        />
        <label
          htmlFor={`checkbox-${id}-${uniqueId}`}
          className="text-sm leading-tight cursor-pointer break-words whitespace-normal"
        >
          {title}
        </label>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold uppercase m-0 leading-tight">
            Whole-Cell Protein Lysate Preparation Using Detergent-Based Buffer
          </h1>
          <p className="text-gray-600 mt-0.5 mb-0">Protocol</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowParameterSummary(true)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Parameters ({parameters.length})
          </Button>
          <Button className="h-10 leading-10 px-4 bg-black hover:bg-gray-800 text-white text-base font-normal rounded-lg">
            Save Module
          </Button>
          <Button
            variant="outline"
            className="h-10 leading-10 px-4 border-gray-300 text-gray-700 rounded-lg bg-transparent"
          >
            <Download className="mr-2 h-4 w-4" /> PDF
          </Button>
          <Button
            variant={showTheoryHints ? "default" : "outline"}
            size="sm"
            onClick={() => setShowTheoryHints(!showTheoryHints)}
            className="flex items-center gap-2"
          >
            <Info className="h-4 w-4" />
            Theory hints
          </Button>
          <Button
            variant={showReferences ? "default" : "outline"}
            size="sm"
            onClick={() => setShowReferences(!showReferences)}
            className="flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            References
          </Button>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={cn(
                "px-4 py-3 text-base relative",
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

      {activeTab === "general-protocol" && (
        <div className="border border-gray-200 rounded-lg p-6 relative ml-12">
          <div className="absolute top-6 right-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F3F4F6] text-[#374151]">
              Protocol ID: CM-001
            </span>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Sample Preparation</h2>

              <div className="space-y-6">
                <div>
                  <StepHeading number={1}>Cell Harvesting</StepHeading>
                  <p>Transfer the suspension culture into a pre-chilled tube.</p>
                  <p>
                    Centrifuge{" "}
                    <EditableParameter
                      parameter={parameters.find((p) => p.id === "centrifuge-speed-harvest")!}
                      onEdit={setEditingParameter}
                    />{" "}
                    for{" "}
                    <EditableParameter
                      parameter={parameters.find((p) => p.id === "centrifuge-time-harvest")!}
                      onEdit={setEditingParameter}
                    />
                    , 4 °C.
                  </p>
                  <p>Carefully discard the supernatant.</p>
                </div>

                <div>
                  <StepHeading number={2}>Wash Cells (Pre-lysis)</StepHeading>
                  <p>
                    Add cold PBS, gently resuspend, centrifuge{" "}
                    <EditableParameter
                      parameter={parameters.find((p) => p.id === "centrifuge-speed-wash")!}
                      onEdit={setEditingParameter}
                    />
                    , 5 min, 4 °C.
                  </p>
                  <p>Remove the supernatant completely.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Lysis Buffer Preparation</h2>

              <div className="space-y-6">
                <div>
                  <StepHeading number={3}>Preparation of Base Buffer (RIPA)</StepHeading>
                  <p>
                    Prepare RIPA buffer (e.g., 50 mM Tris-HCl pH 7.4, 150 mM NaCl, 1% NP-40, 0.5% deoxycholate, 0.1%
                    SDS).
                  </p>
                  <p>Keep on ice.</p>
                </div>

                <div>
                  <StepHeading number={4}>Add Protease Inhibitors</StepHeading>
                  <p>Add protease inhibitor cocktail to 1× final concentration.</p>
                  <p>Mix gently and keep on ice.</p>
                </div>

                <div>
                  <StepHeading number={5}>Work on Ice / Pre-chilled Buffers</StepHeading>
                  <p>All solutions and handling should be maintained at 0–4 °C to minimize protein degradation.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Principal Work</h2>

              <div className="space-y-6">
                <div>
                  <StepHeading number={6}>Lysis (Chemical only)</StepHeading>
                  <p>Add cold RIPA buffer to the pellet (≈ 1 ml per 0.5–5 × 10⁷ cells).</p>
                  <p>
                    Resuspend thoroughly and incubate on ice for{" "}
                    <EditableParameter
                      parameter={parameters.find((p) => p.id === "lysis-time")!}
                      onEdit={setEditingParameter}
                    />
                    , mixing occasionally.
                  </p>
                </div>

                <div>
                  <StepHeading number={7}>DNase Treatment (viscosity control)</StepHeading>
                  <p>Add DNase I (as per settings in parameters) + MgCl₂ if required.</p>
                  <p>
                    Incubate on ice for{" "}
                    <EditableParameter
                      parameter={parameters.find((p) => p.id === "dnase-incubation")!}
                      onEdit={setEditingParameter}
                    />
                    , mix gently.
                  </p>
                </div>

                <div>
                  <StepHeading number={8}>Clarification — Pre-cleared (low-speed)</StepHeading>
                  <p>
                    Centrifuge{" "}
                    <EditableParameter
                      parameter={parameters.find((p) => p.id === "clarification-speed")!}
                      onEdit={setEditingParameter}
                    />{" "}
                    for{" "}
                    <EditableParameter
                      parameter={parameters.find((p) => p.id === "clarification-time")!}
                      onEdit={setEditingParameter}
                    />
                    , 4 °C.
                  </p>
                  <p>
                    Debris forms a pellet. Carefully collect the supernatant and transfer to a new pre-chilled tube.
                  </p>
                  <p>This supernatant is the whole-cell protein lysate.</p>
                </div>

                <div>
                  <StepHeading number={9}>Snap-freeze</StepHeading>
                  <p>Store lysate aliquots at –80 °C.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "buffer-recipes" && (
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Buffer Recipes</h2>
            <p className="text-gray-600 mb-4">
              Select which buffer recipes you want to display. Click the checkboxes to show or hide specific recipes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-6 p-4 bg-gray-50 rounded-lg">
              {recipes.map((recipe) => (
                <RecipeCheckbox
                  key={recipe.id}
                  id={recipe.id}
                  title={recipe.title}
                  checked={recipe.visible}
                  onCheckedChange={() => toggleRecipeVisibility(recipe.id)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <EnhancedBufferRecipeSection
              id="ripa-buffer"
              title="RIPA Lysis Buffer"
              visible={recipes.find((r) => r.id === "ripa-buffer")?.visible || false}
              defaultVolume={100}
              ingredients={[
                { name: "Tris-HCl pH 7.4", amount: 50, unit: "mM" },
                { name: "NaCl", amount: 150, unit: "mM" },
                { name: "EDTA", amount: 1, unit: "mM" },
                { name: "Triton X-100", amount: 1, unit: "%" },
                { name: "Sodium deoxycholate", amount: 0.5, unit: "%" },
                { name: "SDS", amount: 0.1, unit: "%" },
              ]}
              instructions={[
                "1. Dissolve all components in distilled water.",
                "2. Adjust pH to 7.4 with HCl if necessary.",
                "3. Store at 4°C for up to 1 month.",
                "4. Add protease/phosphatase inhibitors immediately before use.",
              ]}
            />

            <EnhancedBufferRecipeSection
              id="np40-buffer"
              title="NP-40 Lysis Buffer"
              visible={recipes.find((r) => r.id === "np40-buffer")?.visible || false}
              defaultVolume={100}
              ingredients={[
                { name: "Tris-HCl pH 8.0", amount: 50, unit: "mM" },
                { name: "NaCl", amount: 150, unit: "mM" },
                { name: "NP-40", amount: 1, unit: "%" },
              ]}
              instructions={[
                "1. Dissolve Tris-HCl and NaCl in distilled water.",
                "2. Add NP-40 and mix well.",
                "3. Adjust pH to 8.0 if necessary.",
                "4. Store at 4°C. Add inhibitors before use.",
              ]}
            />

            <EnhancedBufferRecipeSection
              id="pbs"
              title="PBS (Phosphate-Buffered Saline)"
              visible={recipes.find((r) => r.id === "pbs")?.visible || false}
              defaultVolume={1000}
              ingredients={[
                { name: "NaCl", amount: 8, unit: "g" },
                { name: "KCl", amount: 0.2, unit: "g" },
                { name: "Na₂HPO₄", amount: 1.44, unit: "g" },
                { name: "KH₂PO₄", amount: 0.24, unit: "g" },
              ]}
              instructions={[
                "1. Dissolve all salts in approximately 800 mL of distilled water.",
                "2. Adjust pH to 7.4 with HCl or NaOH.",
                "3. Adjust the final volume to final volume.",
                "4. Autoclave or filter-sterilize. Store at room temperature.",
              ]}
            />

            <EnhancedBufferRecipeSection
              id="tbs"
              title="TBS (Tris-Buffered Saline)"
              visible={recipes.find((r) => r.id === "tbs")?.visible || false}
              defaultVolume={1000}
              ingredients={[
                { name: "Tris base", amount: 2.42, unit: "g" },
                { name: "NaCl", amount: 8, unit: "g" },
              ]}
              instructions={[
                "1. Dissolve Tris base and NaCl in approximately 800 mL of distilled water.",
                "2. Adjust pH to 7.6 with HCl.",
                "3. Adjust the final volume to final volume.",
                "4. Store at room temperature.",
              ]}
            />
          </div>
        </div>
      )}

      {activeTab === "materials-list" && (
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Materials List</h2>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                <strong>Note:</strong> The materials list for this module includes lysis buffers, protease/phosphatase
                inhibitors, centrifuge tubes, and wash buffers. Detailed supplier information will be added in a future
                update.
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Essential Materials</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Lysis buffer (RIPA, NP-40, or custom)</li>
                <li>Protease/phosphatase inhibitor cocktail</li>
                <li>PBS or TBS for washing</li>
                <li>Centrifuge tubes (15 mL or 50 mL)</li>
                <li>Microcentrifuge tubes (1.5 mL or 2 mL)</li>
                <li>Refrigerated centrifuge</li>
                <li>Ice bucket and ice</li>
                <li>Pipettes and tips</li>
                <li>Optional: Sonicator for cell disruption</li>
                <li>Optional: Liquid nitrogen for snap-freezing</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <ParameterSummaryTable
        parameters={parameters}
        isOpen={showParameterSummary}
        onClose={() => setShowParameterSummary(false)}
        onParameterEdit={setEditingParameter}
      />

      {editingParameter && (
        <ParameterEditor
          parameter={editingParameter}
          isOpen={!!editingParameter}
          onClose={() => setEditingParameter(null)}
          onSave={(value) => handleParameterSave(editingParameter.id, value)}
        />
      )}
    </div>
  )
}
