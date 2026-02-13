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

interface ChemicalForm {
  name: string
  molarMass: number
}

interface Ingredient {
  name: string
  amount: number
  unit: string
  molarMass?: number
  forms?: ChemicalForm[]
  isVolume?: boolean
  altAmount?: number
  altUnit?: string
}

interface RecipeVariant {
  name: string
  description?: string
  ingredients: Ingredient[]
}

interface EnhancedBufferRecipeSectionProps {
  id: string
  title: string
  visible: boolean
  defaultVolume: number
  ingredients?: Ingredient[]
  instructions: string[]
  hasMultipleVariants?: boolean
  variants?: RecipeVariant[]
}

interface MaterialItem {
  id: string
  name: string
  checked: boolean
  source?: "prepare" | "stock" | "purchase"
  product?: {
    manufacturer: string
    productName: string
    catalogNumber: string
  }
}

interface BufferItem extends MaterialItem {
  requiredReagents?: string[]
}

interface ProductOption {
  manufacturer: string
  productName: string
  catalogNumber: string
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

const EnhancedBufferRecipeSection = ({
  id,
  title,
  visible,
  defaultVolume,
  ingredients = [],
  instructions,
  hasMultipleVariants = false,
  variants = [],
}: EnhancedBufferRecipeSectionProps) => {
  const [volume, setVolume] = useState(defaultVolume)
  const [selectedForms, setSelectedForms] = useState<Record<string, string>>({})

  const calculateFormAdjustedAmount = (ingredient: Ingredient, selectedForm?: string) => {
    if (!ingredient.forms || !selectedForm) return ingredient.amount

    const originalForm = ingredient.forms[0]
    const newForm = ingredient.forms.find((f) => f.name === selectedForm)

    if (!newForm || !originalForm) return ingredient.amount

    const adjustmentFactor = newForm.molarMass / originalForm.molarMass
    return ingredient.amount * adjustmentFactor
  }

  const handleFormChange = (ingredientName: string, formName: string) => {
    setSelectedForms((prev) => ({
      ...prev,
      [ingredientName]: formName,
    }))
  }

  const renderIngredient = (ingredient: Ingredient, scaleFactor: number) => {
    const selectedForm = selectedForms[ingredient.name]
    const baseAmount = calculateFormAdjustedAmount(ingredient, selectedForm)
    const scaledAmount = (baseAmount * scaleFactor).toFixed(2)

    return (
      <div
        key={ingredient.name}
        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">– {ingredient.name}</span>
            {ingredient.forms && ingredient.forms.length > 1 && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">Form:</span>
                <select
                  value={selectedForm || ingredient.forms[0].name}
                  onChange={(e) => handleFormChange(ingredient.name, e.target.value)}
                  className="text-xs border border-gray-300 rounded px-1 py-0.5"
                >
                  {ingredient.forms.map((form) => (
                    <option key={form.name} value={form.name}>
                      {form.name}
                    </option>
                  ))}
                </select>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-xs">
                        <p>Available forms:</p>
                        {ingredient.forms.map((form) => (
                          <p key={form.name}>
                            • {form.name}: {form.molarMass} g/mol
                          </p>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
          {ingredient.altAmount && (
            <div className="text-xs text-gray-500 mt-1">
              Alternative: {(ingredient.altAmount * scaleFactor).toFixed(2)} {ingredient.altUnit}
            </div>
          )}
        </div>
        <div className="font-mono text-sm">
          <span className="font-semibold">
            {scaledAmount} {ingredient.unit}
          </span>
          {scaleFactor !== 1 && (
            <span className="text-xs text-gray-500 ml-2">
              (orig: {baseAmount.toFixed(2)} {ingredient.unit})
            </span>
          )}
        </div>
      </div>
    )
  }

  if (!visible) return null

  const scaleFactor = volume / defaultVolume

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

      {hasMultipleVariants ? (
        <div className="space-y-6">
          {variants.map((variant, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium mb-2">{variant.name}</h4>
              {variant.description && <p className="text-sm text-gray-600 mb-3">{variant.description}</p>}
              <div className="space-y-1">
                {variant.ingredients.map((ingredient) => renderIngredient(ingredient, scaleFactor))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="space-y-1">{ingredients.map((ingredient) => renderIngredient(ingredient, scaleFactor))}</div>
        </div>
      )}

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
            <h3 className="text-lg font-semibold">Protocol Parameters Summary</h3>
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

export default function WesternBlotExampleProtocolPage() {
  const [activeTab, setActiveTab] = useState("general-protocol")
  const [showTheoryHints, setShowTheoryHints] = useState(true)
  const [showReferences, setShowReferences] = useState(false)
  const [expandedReferences, setExpandedReferences] = useState<number[]>([])
  const [showParameterSummary, setShowParameterSummary] = useState(false)
  const [editingParameter, setEditingParameter] = useState<ParameterRange | null>(null)
  const uniqueId = useId()

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

  const theoryHints: TheoryHint[] = [
    {
      id: "hint-3",
      stepNumber: 3,
      type: "critical",
      content: "PVDF membranes must be pre-wetted in methanol before use. Nitrocellulose does not require methanol.",
    },
    {
      id: "hint-6",
      stepNumber: 6,
      type: "info",
      content:
        "Wet transfer provides more uniform transfer but takes longer. Semi-dry is faster but may be less uniform.",
    },
    {
      id: "hint-9",
      stepNumber: 9,
      type: "critical",
      content: "Complete blocking is essential to prevent high background. Do not skip or shorten this step.",
    },
    {
      id: "hint-12",
      stepNumber: 12,
      type: "info",
      content: "Protect from light when using fluorescent secondary antibodies to prevent photobleaching.",
    },
  ]

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

  const stepReferences: StepReference[] = [
    {
      id: "ref-3",
      stepNumber: 3,
      citations: [
        {
          authors: "Towbin et al.",
          year: 1979,
          title: "Electrophoretic transfer of proteins from polyacrylamide gels to nitrocellulose sheets",
          journal: "Proc Natl Acad Sci USA",
          doi: "10.1073/pnas.76.9.4350",
        },
      ],
    },
    {
      id: "ref-6",
      stepNumber: 6,
      citations: [
        {
          authors: "Burnette, W.N.",
          year: 1981,
          title: "Western blotting: electrophoretic transfer of proteins",
          journal: "Anal Biochem",
          doi: "10.1016/0003-2697(81)90281-5",
        },
      ],
    },
    {
      id: "ref-9",
      stepNumber: 9,
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
      id: "ref-10",
      stepNumber: 10,
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
    {
      id: "ref-13",
      stepNumber: 13,
      citations: [
        {
          authors: "Gassmann et al.",
          year: 2009,
          title: "Quantifying Western blots: pitfalls of densitometry",
          journal: "Electrophoresis",
          doi: "10.1002/elps.200900097",
        },
      ],
    },
  ]

  const tabs = [
    { id: "general-protocol", label: "Protocol" },
    { id: "buffer-recipes", label: "Buffer Recipes" },
    { id: "materials-list", label: "Materials List" },
  ]

  const recipesList = [
    { id: "transfer-buffer", title: "Transfer Buffer (Towbin)" },
    { id: "tbs", title: "10X TBS (Tris-Buffered Saline)" },
    { id: "tbst", title: "TBST (TBS with Tween-20)" },
    { id: "blocking-buffer", title: "Blocking Buffer (5% Milk)" },
    { id: "stripping-buffer", title: "Stripping Buffer" },
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

  const handleBufferModeChange = (bufferId: string, mode: "prepare" | "stock" | "purchase") => {
    setBuffers((prev) => prev.map((b) => (b.id === bufferId ? { ...b, mode } : b)))

    // Update reagent active status
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
    setHighlightedReagents(ingredientIds)
    document.getElementById("reagents-section")?.scrollIntoView({ behavior: "smooth" })
    setTimeout(() => setHighlightedReagents([]), 2000)
  }

  const handleClearChoices = () => {
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
    // Mock CSV export
    alert("CSV export functionality will be implemented")
  }

  const handleExportPDF = () => {
    // Mock PDF export
    alert("PDF export functionality will be implemented")
  }

  const handleApplyToProtocol = () => {
    // Save materials selections
    alert("Materials selections saved to protocol")
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

  // Mock brand/product options
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

  return (
    <div className="w-full">
      {/* Protocol header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold uppercase m-0 leading-tight">Western Blot Protocol</h1>
          <p className="text-gray-600 mt-0.5 mb-0">Complete protocol with all parameters</p>
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
            Save Protocol
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

      {/* Tab Bar */}
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

      {/* Protocol Content */}
      {activeTab === "general-protocol" && (
        <div className="border border-gray-200 rounded-lg p-6 relative ml-12">
          <div className="absolute top-6 right-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F3F4F6] text-[#374151]">
              Protocol ID: WB-001
            </span>
          </div>

          <div className="space-y-8">
            <div>
              <StepHeading number={1}>Preparation of the Stack Components</StepHeading>
              <p>
                Gather all materials needed for the transfer stack: gel, membrane, filter papers, and sponges (if using
                wet transfer). Ensure all components are clean and ready for assembly.
              </p>
            </div>

            <div>
              <StepHeading number={2}>Equilibrate the Gel</StepHeading>
              <p>
                After electrophoresis, carefully remove the gel from the glass plates. Equilibrate the gel in transfer
                buffer for 10-15 minutes to ensure optimal transfer conditions and remove residual SDS.
              </p>
            </div>

            <div>
              <StepHeading number={3}>Pre-wetting of Membrane</StepHeading>
              <ol className="list-[lower-alpha] pl-5 space-y-2 mt-2">
                <li>
                  <span className="font-medium">For PVDF membranes:</span>
                  <p className="mt-1">
                    Pre-wet the membrane in 100% methanol for 15 seconds, then rinse in distilled water for 2 minutes,
                    followed by equilibration in transfer buffer for at least 5 minutes.
                  </p>
                </li>
                <li>
                  <span className="font-medium">For Nitrocellulose membranes:</span>
                  <p className="mt-1">
                    Wet the membrane directly in transfer buffer for at least 10 minutes. Do not use methanol.
                  </p>
                </li>
              </ol>
            </div>

            <div>
              <StepHeading number={4}>Pre-wetting of the Filter Papers</StepHeading>
              <p>
                Cut filter papers to the size of the gel. Soak them thoroughly in transfer buffer until completely
                saturated. Remove any air bubbles by gently pressing the papers.
              </p>
            </div>

            <div>
              <StepHeading number={5}>Pre-wetting of the Sponges</StepHeading>
              <p>
                If using wet transfer, soak the sponges in transfer buffer until fully saturated. Squeeze gently to
                remove excess buffer and any trapped air bubbles.
              </p>
            </div>

            <div>
              <StepHeading number={6}>Setting up the Transfer Apparatus</StepHeading>
              <ol className="list-[lower-alpha] pl-5 space-y-2 mt-2">
                <li>
                  <span className="font-medium">For Wet Transfer:</span>
                  <p className="mt-1">
                    Assemble the transfer sandwich in a dish filled with transfer buffer. Layer from cathode (black) to
                    anode (red): sponge → filter paper → gel → membrane → filter paper → sponge. Roll out air bubbles
                    between each layer.
                  </p>
                </li>
                <li>
                  <span className="font-medium">For Semi-dry Transfer:</span>
                  <p className="mt-1">
                    Place the transfer stack directly on the semi-dry apparatus. Layer from bottom to top: filter papers
                    → gel → membrane → filter papers. Ensure no air bubbles are trapped.
                  </p>
                </li>
              </ol>
            </div>

            <div>
              <StepHeading number={7}>Transfer Conditions</StepHeading>
              <ol className="list-[lower-alpha] pl-5 space-y-2 mt-2">
                <li>
                  <span className="font-medium">Wet Transfer:</span>
                  <p className="mt-1">
                    Transfer at{" "}
                    <EditableParameter
                      parameter={parameters.find((p) => p.id === "transfer-voltage")!}
                      onEdit={setEditingParameter}
                    />{" "}
                    for{" "}
                    <EditableParameter
                      parameter={parameters.find((p) => p.id === "transfer-time")!}
                      onEdit={setEditingParameter}
                    />{" "}
                    at 4°C with stirring. Use an ice pack to maintain temperature.
                  </p>
                </li>
                <li>
                  <span className="font-medium">Semi-dry Transfer:</span>
                  <p className="mt-1">
                    Transfer at 25V for 30-45 minutes at room temperature. Monitor to ensure the apparatus does not
                    overheat.
                  </p>
                </li>
              </ol>
            </div>

            <div>
              <StepHeading number={8}>Removing and Marking the Membrane</StepHeading>
              <p>
                After transfer, carefully disassemble the sandwich. Mark the membrane orientation with a pencil or by
                cutting a corner. Optionally, stain with Ponceau S to verify transfer efficiency and mark molecular
                weight markers.
              </p>
            </div>

            <div>
              <StepHeading number={9}>Blocking</StepHeading>
              <p>
                Block the membrane in blocking buffer (5% non-fat dry milk in TBST or 5% BSA in TBST) for{" "}
                <EditableParameter
                  parameter={parameters.find((p) => p.id === "blocking-time")!}
                  onEdit={setEditingParameter}
                />{" "}
                at room temperature with gentle shaking. This prevents non-specific antibody binding.
              </p>
            </div>

            <div>
              <StepHeading number={10}>Primary Antibody Incubation</StepHeading>
              <ol className="list-[lower-alpha] pl-5 space-y-2 mt-2">
                <li>
                  Dilute the primary antibody in blocking buffer or antibody dilution buffer at{" "}
                  <EditableParameter
                    parameter={parameters.find((p) => p.id === "primary-ab-dilution")!}
                    onEdit={setEditingParameter}
                  />{" "}
                  dilution (or as recommended by manufacturer).
                </li>
                <li>
                  Incubate the membrane with primary antibody overnight at 4°C with gentle shaking, or for 1-2 hours at
                  room temperature.
                </li>
                <li>Save the antibody solution if it can be reused according to manufacturer's instructions.</li>
              </ol>
            </div>

            <div>
              <StepHeading number={11}>Washing</StepHeading>
              <p>
                Wash the membrane{" "}
                <EditableParameter
                  parameter={parameters.find((p) => p.id === "wash-cycles")!}
                  onEdit={setEditingParameter}
                />{" "}
                with TBST, 5-10 minutes per wash, with gentle shaking. This removes unbound primary antibody.
              </p>
            </div>

            <div>
              <StepHeading number={12}>Secondary Antibody Incubation</StepHeading>
              <ol className="list-[lower-alpha] pl-5 space-y-2 mt-2">
                <li>
                  Dilute the HRP-conjugated or fluorescent secondary antibody in blocking buffer according to
                  manufacturer's recommendations (typically 1:5,000 to 1:10,000).
                </li>
                <li>
                  Incubate the membrane with secondary antibody for 1 hour at room temperature with gentle shaking.
                </li>
                <li>
                  <span className="font-medium">Light Protection:</span> If using fluorescent secondary antibodies,
                  protect from light during incubation and all subsequent steps.
                </li>
              </ol>
            </div>

            <div>
              <StepHeading number={13}>Detection</StepHeading>
              <ol className="list-[lower-alpha] pl-5 space-y-2 mt-2">
                <li>Wash the membrane 3-5 times with TBST, 5-10 minutes per wash.</li>
                <li>
                  <span className="font-medium">For ECL Detection:</span>
                  <p className="mt-1">
                    Apply ECL substrate to the membrane according to manufacturer's instructions. Incubate for 1-5
                    minutes, then image using a chemiluminescence imaging system.
                  </p>
                </li>
                <li>
                  <span className="font-medium">For Fluorescent Detection:</span>
                  <p className="mt-1">
                    Image the membrane using an appropriate fluorescence imaging system with the correct excitation and
                    emission wavelengths.
                  </p>
                </li>
              </ol>
            </div>

            <div>
              <StepHeading number={14}>Quantification</StepHeading>
              <ol className="list-[lower-alpha] pl-5 space-y-2 mt-2">
                <li>
                  <span className="font-medium">Housekeeping Protein Normalization:</span>
                  <p className="mt-1">
                    Strip and reprobe the membrane with a housekeeping protein antibody (e.g., β-actin, GAPDH, tubulin)
                    to normalize for loading differences.
                  </p>
                </li>
                <li>
                  <span className="font-medium">Total Protein Normalization:</span>
                  <p className="mt-1">
                    Alternatively, stain the membrane with total protein stain (e.g., Ponceau S, Amido Black) before
                    blocking to normalize against total protein load.
                  </p>
                </li>
                <li>Use densitometry software to quantify band intensities and calculate relative protein levels.</li>
              </ol>
            </div>

            <div>
              <StepHeading number={15}>Documentation and Data Storage</StepHeading>
              <ol className="list-[lower-alpha] pl-5 space-y-2 mt-2">
                <li>Capture high-resolution images of the blot with appropriate exposure times to avoid saturation.</li>
                <li>
                  Record all experimental parameters: antibody dilutions, incubation times, transfer conditions, and
                  detection method.
                </li>
                <li>
                  Store the membrane at 4°C in TBST or PBS if you plan to reprobe. For long-term storage, dry the
                  membrane and store at room temperature.
                </li>
                <li>
                  Archive raw image files and analysis data according to your laboratory's data management protocols.
                </li>
              </ol>
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
              id="transfer-buffer"
              title="Transfer Buffer (Towbin)"
              visible={recipes.find((r) => r.id === "transfer-buffer")?.visible || false}
              defaultVolume={1000}
              ingredients={[
                { name: "Tris base", amount: 3.03, unit: "g", molarMass: 121.14 },
                { name: "Glycine", amount: 14.4, unit: "g", molarMass: 75.07 },
                { name: "Methanol", amount: 200, unit: "mL", isVolume: true },
              ]}
              instructions={[
                "1. Dissolve Tris base and glycine in approximately 700 mL of distilled water.",
                "2. Add methanol and mix well.",
                "3. Adjust the final volume to final volume with distilled water.",
                "4. Store at 4°C. Use within 1 week.",
              ]}
            />

            <EnhancedBufferRecipeSection
              id="tbs"
              title="10X TBS (Tris-Buffered Saline)"
              visible={recipes.find((r) => r.id === "tbs")?.visible || false}
              defaultVolume={1000}
              ingredients={[
                { name: "Tris base", amount: 24.2, unit: "g", molarMass: 121.14 },
                { name: "NaCl", amount: 80, unit: "g", molarMass: 58.44 },
              ]}
              instructions={[
                "1. Dissolve Tris base and NaCl in approximately 800 mL of distilled water.",
                "2. Adjust pH to 7.6 with HCl.",
                "3. Adjust the final volume to final volume with distilled water.",
                "4. Store at room temperature. Dilute 1:10 before use.",
              ]}
            />

            <EnhancedBufferRecipeSection
              id="tbst"
              title="TBST (TBS with Tween-20)"
              visible={recipes.find((r) => r.id === "tbst")?.visible || false}
              defaultVolume={1000}
              ingredients={[
                { name: "10X TBS", amount: 100, unit: "mL", isVolume: true },
                { name: "Tween-20", amount: 1, unit: "mL", isVolume: true },
              ]}
              instructions={[
                "1. Add 10X TBS to approximately 800 mL of distilled water.",
                "2. Add Tween-20 and mix well.",
                "3. Adjust the final volume to final volume with distilled water.",
                "4. Store at room temperature for up to 1 month.",
              ]}
            />

            <EnhancedBufferRecipeSection
              id="blocking-buffer"
              title="Blocking Buffer (5% Milk)"
              visible={recipes.find((r) => r.id === "blocking-buffer")?.visible || false}
              defaultVolume={100}
              ingredients={[
                { name: "Non-fat dry milk", amount: 5, unit: "g" },
                { name: "TBST", amount: 100, unit: "mL", isVolume: true },
              ]}
              instructions={[
                "1. Add non-fat dry milk to TBST.",
                "2. Mix until completely dissolved.",
                "3. Prepare fresh before use.",
                "4. Alternative: Use 5% BSA in TBST for phospho-protein detection.",
              ]}
            />

            <EnhancedBufferRecipeSection
              id="stripping-buffer"
              title="Stripping Buffer"
              visible={recipes.find((r) => r.id === "stripping-buffer")?.visible || false}
              defaultVolume={100}
              ingredients={[
                { name: "Tris-HCl pH 6.8", amount: 6.25, unit: "mL", isVolume: true },
                { name: "SDS (10%)", amount: 20, unit: "mL", isVolume: true },
                { name: "β-Mercaptoethanol", amount: 0.7, unit: "mL", isVolume: true },
              ]}
              instructions={[
                "1. Mix Tris-HCl and SDS.",
                "2. Add β-Mercaptoethanol just before use.",
                "3. Adjust the final volume to final volume with distilled water.",
                "4. Use immediately. Incubate membrane at 50°C for 30 minutes with gentle shaking.",
              ]}
            />
          </div>
        </div>
      )}

      {activeTab === "materials-list" && (
        <div className="border border-gray-200 rounded-lg">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Materials Planner</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Set procurement mode for buffers/solutions and select vendor products for commercial items.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={handleClearChoices}>
                  Clear choices
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportCSV}>
                  Export CSV
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportPDF}>
                  Export PDF
                </Button>
                <Button onClick={handleApplyToProtocol} className="bg-black hover:bg-gray-800">
                  Apply to Protocol
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Buffers & Solutions ({buffers.length})</h3>
              <div className="space-y-4">
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
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-gray-400 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-sm">
                                  Changing this choice updates the Purchasing list and whether reagent components are
                                  required for prep.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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
            </div>

            <div id="reagents-section">
              <h3 className="text-lg font-semibold mb-4">Reagents ({reagents.filter((r) => r.active).length})</h3>
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

            <div>
              <h3 className="text-lg font-semibold mb-4">Supplies ({supplies.length})</h3>
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
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Equipment ({equipment.length})</h3>
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
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Purchasing Summary ({totalPurchaseItems})</h3>
              <p className="text-sm text-gray-600 mb-4">
                Auto-generated list of items that must be purchased given current choices.
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
          </div>
        </div>
      )}

      {/* Parameter Summary Modal */}
      <ParameterSummaryTable
        parameters={parameters}
        isOpen={showParameterSummary}
        onClose={() => setShowParameterSummary(false)}
        onParameterEdit={setEditingParameter}
      />

      {/* Parameter Editor Modal */}
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
