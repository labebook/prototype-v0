"use client"

import type React from "react"

import { useState, useId } from "react"
import { Download, Pencil, Info, Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Add these interfaces before the main component
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

// Add new interfaces and state management for materials tracking after the existing interfaces:
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

// New interfaces for parameter management
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

interface ProtocolStep {
  id: string
  title: string
  description: string
  time?: string
  temperature?: string
  notes?: string
  critical?: boolean
  parameters?: { [key: string]: string | number }
}

interface BufferRecipe {
  name: string
  components: Array<{
    name: string
    concentration: string
    amount: string
    molWeight?: number
  }>
  finalVolume: string
  ph?: string
  notes?: string
}

interface Material {
  name: string
  supplier?: string
  catalog?: string
  alternatives?: string[]
  selected?: boolean
}

// Enhanced Buffer Recipe Section Component
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

  // Calculate scaled amounts based on volume
  const calculateScaledAmount = (originalAmount: number, originalVolume: number, newVolume: number) => {
    const scaleFactor = newVolume / originalVolume
    return (originalAmount * scaleFactor).toFixed(2)
  }

  // Calculate amount based on chemical form
  const calculateFormAdjustedAmount = (ingredient: Ingredient, selectedForm?: string) => {
    if (!ingredient.forms || !selectedForm) return ingredient.amount

    const originalForm = ingredient.forms[0]
    const newForm = ingredient.forms.find((f) => f.name === selectedForm)

    if (!newForm || !originalForm) return ingredient.amount

    // Adjust amount based on molar mass difference
    const adjustmentFactor = newForm.molarMass / originalForm.molarMass
    return ingredient.amount * adjustmentFactor
  }

  // Handle form selection
  const handleFormChange = (ingredientName: string, formName: string) => {
    setSelectedForms((prev) => ({
      ...prev,
      [ingredientName]: formName,
    }))
  }

  // Render ingredient with form selector if applicable
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

// Parameter Editor Component
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

// Parameter Summary Table Component
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

  // Group parameters by step
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

// Editable Parameter Component
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

// Define recipe types for type safety
interface Recipe {
  id: string
  title: string
  visible: boolean
}

export default function SdsPageExampleProtocolPage() {
  const [activeTab, setActiveTab] = useState("general-protocol")
  const [showTheoryHints, setShowTheoryHints] = useState(true)
  const [showParameterSummary, setShowParameterSummary] = useState(false)
  const [editingParameter, setEditingParameter] = useState<ParameterRange | null>(null)
  const uniqueId = useId()
  const [editableParams, setEditableParams] = useState({
    gelPercentage: "12",
    sampleVolume: "20",
    runningVoltage: "120",
    runningTime: "90",
    bufferVolume: "1000",
    gelThickness: "1.0",
  })

  const [protocolSteps] = useState<ProtocolStep[]>([
    {
      id: "prep-1",
      title: "Prepare Resolving Gel Solution",
      description: "Mix acrylamide, Tris-HCl buffer, SDS, and water. Add APS and TEMED just before pouring.",
      time: "10 min",
      critical: true,
      parameters: { gelPercentage: 12, volume: 10 },
    },
    {
      id: "prep-2",
      title: "Cast Resolving Gel",
      description:
        "Pour gel solution between glass plates, leaving space for stacking gel. Overlay with water or isopropanol.",
      time: "5 min",
      notes: "Ensure no air bubbles are trapped",
    },
    {
      id: "prep-3",
      title: "Prepare Stacking Gel Solution",
      description: "Mix lower concentration acrylamide solution with stacking gel buffer.",
      time: "5 min",
      parameters: { gelPercentage: 4, volume: 3 },
    },
    {
      id: "prep-4",
      title: "Cast Stacking Gel",
      description: "Remove overlay, pour stacking gel, insert comb immediately.",
      time: "3 min",
      critical: true,
    },
    {
      id: "sample-1",
      title: "Prepare Protein Samples",
      description: "Mix samples with loading buffer containing SDS and reducing agent. Heat if required.",
      time: "10 min",
      temperature: "95°C",
      parameters: { sampleVolume: 20, loadingBufferRatio: "1:1" },
    },
    {
      id: "run-1",
      title: "Load Samples",
      description: "Carefully load samples into wells using micropipette. Include molecular weight markers.",
      time: "5 min",
      critical: true,
    },
    {
      id: "run-2",
      title: "Run Electrophoresis",
      description: "Run at constant voltage until dye front reaches bottom of gel.",
      time: "60-90 min",
      temperature: "4°C",
      parameters: { voltage: 120, current: "25-30 mA" },
    },
    {
      id: "detect-1",
      title: "Stain Gel",
      description: "Remove gel from plates and stain with Coomassie Blue or other protein stain.",
      time: "30-60 min",
      notes: "Handle gel carefully to avoid tearing",
    },
  ])

  const [bufferRecipes] = useState<BufferRecipe[]>([
    {
      name: "10X Tris-Glycine Running Buffer",
      components: [
        { name: "Tris Base", concentration: "250 mM", amount: "30.3 g", molWeight: 121.14 },
        { name: "Glycine", concentration: "1.92 M", amount: "144.1 g", molWeight: 75.07 },
        { name: "SDS", concentration: "1%", amount: "10 g", molWeight: 288.38 },
      ],
      finalVolume: "1000 mL",
      ph: "8.3",
      notes: "Dilute 1:10 with distilled water before use",
    },
    {
      name: "4X Sample Loading Buffer",
      components: [
        { name: "Tris-HCl pH 6.8", concentration: "200 mM", amount: "2.4 mL of 1M stock" },
        { name: "SDS", concentration: "8%", amount: "0.8 g" },
        { name: "Glycerol", concentration: "40%", amount: "4 mL" },
        { name: "Bromophenol Blue", concentration: "0.4%", amount: "0.04 g" },
        { name: "β-Mercaptoethanol", concentration: "10%", amount: "1 mL" },
      ],
      finalVolume: "10 mL",
      notes: "Store at -20°C in aliquots. Add reducing agent fresh before use.",
    },
  ])

  const [materials] = useState<Material[]>([
    { name: "Acrylamide/Bis-acrylamide (30%)", supplier: "Bio-Rad", catalog: "1610156", selected: true },
    { name: "Tris Base", supplier: "Sigma", catalog: "T1503", alternatives: ["Fisher T395"], selected: true },
    { name: "SDS", supplier: "Sigma", catalog: "L3771", selected: true },
    { name: "APS (Ammonium Persulfate)", supplier: "Bio-Rad", catalog: "1610700", selected: true },
    { name: "TEMED", supplier: "Bio-Rad", catalog: "1610800", selected: true },
    { name: "Protein Ladder", supplier: "Thermo", catalog: "26616", alternatives: ["Bio-Rad 1610374"], selected: true },
    { name: "Coomassie Brilliant Blue R-250", supplier: "Sigma", catalog: "B0149", selected: false },
  ])

  // Parameter management state - expanded to include ALL numeric ranges
  const [parameters, setParameters] = useState<ParameterRange[]>([
    {
      id: "protein-amount-single",
      name: "Single Protein Amount",
      min: 0.5,
      max: 5,
      unit: "µg",
      selectedValue: 3,
      description: "Amount of single purified protein per lane",
      theory: "Higher amounts improve visibility but may cause band saturation",
      stepNumber: 4,
      stepName: "Mix samples with Loading buffer",
    },
    {
      id: "protein-amount-complex",
      name: "Complex Mixture Amount",
      min: 20,
      max: 40,
      unit: "µg",
      selectedValue: 30,
      description: "Amount of complex protein mixture per lane",
      theory: "Complex mixtures require more protein for individual band detection",
      stepNumber: 4,
      stepName: "Mix samples with Loading buffer",
    },
    {
      id: "well-volume-10",
      name: "Well Volume (10-well)",
      min: 20,
      max: 25,
      unit: "µL",
      selectedValue: 25,
      description: "Loading volume for 10-well format gels",
      theory: "Maximum volume depends on well size and gel thickness",
      stepNumber: 4,
      stepName: "Mix samples with Loading buffer",
    },
    {
      id: "well-volume-15",
      name: "Well Volume (15-well)",
      min: 10,
      max: 15,
      unit: "µL",
      selectedValue: 15,
      description: "Loading volume for 15-well format gels",
      theory: "Smaller wells in 15-well format limit loading volume",
      stepNumber: 4,
      stepName: "Mix samples with Loading buffer",
    },
    {
      id: "heating-temp",
      name: "Heating Temperature",
      min: 95,
      max: 100,
      unit: "°C",
      selectedValue: 95,
      description: "Temperature for sample denaturation",
      theory: "Higher temperatures ensure complete denaturation but may cause degradation",
      stepNumber: 6,
      stepName: "Heat the samples",
    },
    {
      id: "heating-time",
      name: "Heating Time",
      min: 3,
      max: 5,
      unit: "min",
      selectedValue: 4,
      description: "Duration of heating for denaturation",
      theory: "Longer heating improves denaturation but may lead to aggregation",
      stepNumber: 6,
      stepName: "Heat the samples",
    },
    {
      id: "standard-volume",
      name: "Standard Volume",
      min: 5,
      max: 10,
      unit: "µL",
      selectedValue: 8,
      description: "Volume of molecular weight standards",
      theory: "Sufficient volume needed for clear marker bands",
      stepNumber: 9,
      stepName: "Load Samples and Standards",
    },
    {
      id: "running-voltage",
      name: "Running Voltage",
      min: 150,
      max: 200,
      unit: "V",
      selectedValue: 200,
      description: "Voltage for electrophoresis",
      theory: "Higher voltage reduces run time but generates more heat",
      stepNumber: 10,
      stepName: "Run the gel",
    },
    {
      id: "initial-voltage",
      name: "Initial Voltage",
      min: 70,
      max: 90,
      unit: "V",
      selectedValue: 80,
      description: "Initial voltage for sample entry",
      theory: "Lower initial voltage ensures even sample entry into stacking gel",
      stepNumber: 10,
      stepName: "Run the gel",
    },
    {
      id: "fixation-time",
      name: "Fixation Time",
      min: 30,
      max: 60,
      unit: "min",
      selectedValue: 45,
      description: "Duration of gel fixation",
      theory: "Longer fixation prevents protein diffusion but may reduce staining efficiency",
      stepNumber: 11,
      stepName: "Stain the Gel",
    },
    {
      id: "staining-time-min",
      name: "Minimum Staining Time",
      min: 30,
      max: 60,
      unit: "min",
      selectedValue: 45,
      description: "Minimum time for Coomassie staining",
      theory: "Shorter times for thin gels, longer for thick gels",
      stepNumber: 11,
      stepName: "Stain the Gel",
    },
    {
      id: "staining-time-max",
      name: "Maximum Staining Time",
      min: 1,
      max: 2,
      unit: "hr",
      selectedValue: 1.5,
      description: "Maximum time for Coomassie staining",
      theory: "Extended staining improves sensitivity but increases background",
      stepNumber: 11,
      stepName: "Stain the Gel",
    },
    {
      id: "scan-resolution",
      name: "Scan Resolution",
      min: 300,
      max: 600,
      unit: "dpi",
      selectedValue: 300,
      description: "Scanner resolution for gel documentation",
      theory: "Higher resolution provides better detail but larger file sizes",
      stepNumber: 12,
      stepName: "Document the Gel",
    },
  ])

  // Theory hints data - using existing hint types
  const theoryHints: TheoryHint[] = [
    {
      id: "quantify-theory",
      stepNumber: 3,
      type: "info",
      content: (
        <>
          <p className="mb-2">
            <strong>Note:</strong> Because proteins vary in amino acid composition, there is no universal extinction
            coefficient. However, for a rough estimate, many laboratories assume A₂₈₀ ≈ 1 for a 1 mg/mL solution of a
            "typical" protein. This approximation is useful for complex mixtures where the exact extinction coefficient
            is unknown.
          </p>
          <p>
            Spectrophotometric determination has limitations, such as reduced accuracy at low protein concentrations and
            interference from nucleic acids and detergents. For more accurate quantification, especially in the presence
            of detergents or reducing agents, methods like BCA, Bradford, or Lowry assays can be used, as they offer
            higher sensitivity and greater tolerance to various buffer components.
          </p>
        </>
      ),
    },
    {
      id: "loading-buffer-theory",
      stepNumber: 4,
      type: "info",
      content: (
        <p>
          <strong>Note:</strong> The loading buffer contains SDS which denatures proteins and gives them a uniform
          negative charge, allowing separation based solely on molecular weight.
        </p>
      ),
    },
    {
      id: "loading-critical",
      stepNumber: 4,
      type: "critical",
      content: (
        <p>
          <strong>Critical:</strong> Accurate calculation of application and correct dilution critically influence the
          overall success of the analysis.
        </p>
      ),
    },
    {
      id: "heating-theory",
      stepNumber: 6,
      type: "info",
      content: (
        <p>
          <strong>Note:</strong> Without a reducing agent (e.g. DTT or β-mercaptoethanol) disulfide bonds will remain
          intact, so complete denaturation may not be achieved under these particular conditions.
        </p>
      ),
    },
    {
      id: "assembly-theory",
      stepNumber: 7,
      type: "info",
      content: (
        <p>
          <strong>Note:</strong> The Bio-Rad chamber assembly instructions can be found at the link (page 6). This
          information is not an advertisement and is provided for information purposes only.
        </p>
      ),
    },
    {
      id: "buffer-theory",
      stepNumber: 8,
      type: "info",
      content: (
        <p>
          <strong>Note:</strong> You can review the procedure for assembling the chamber, its pouring and introducing
          samples by following the link for Bio-Rad and Sigma-Aldrich. This information is not an advertisement and is
          provided for information purposes only.
        </p>
      ),
    },
    {
      id: "voltage-theory",
      stepNumber: 10,
      type: "info",
      content: (
        <>
          <p className="mb-2">
            <strong>Note:</strong> Select voltage (or current) settings based on gel thickness and length, system
            specifications and desired resolution.
          </p>
          <p>
            <strong>Note:</strong> Operate at the highest feasible field strength within the system's heat dissipation
            limits; for extended or high-power runs, actively cool the buffer to prevent temperature spikes.
          </p>
        </>
      ),
    },
    {
      id: "staining-theory",
      stepNumber: 11,
      type: "info",
      content: (
        <>
          <p className="mb-2">
            <strong>Note:</strong> Always wear gloves when handling methanol to protect your skin.
          </p>
          <p>
            Store the gel in destaining solution with 1% glycerol to prevent cracking. Do not use glycerol if the gel
            will be analyzed by mass spectrometry, as it interferes with ionization.
          </p>
        </>
      ),
    },
    {
      id: "evaluation-theory",
      stepNumber: 13,
      type: "info",
      content: (
        <>
          <p className="mb-2">
            <strong>Note:</strong> This is a rough estimation method for routine checks and does not provide precise
            molecular weight values.
          </p>
          <p className="mb-2">
            <strong>Note:</strong> This method is for quick, qualitative assessment. For more accurate analysis, use Rf
            calculations or gel imaging software.
          </p>
          <p>Ensure proper orientation of the gel (marker lane clearly labeled and aligned).</p>
        </>
      ),
    },
  ]

  // Define all available recipes
  const recipesList = [
    { id: "tris-glycine-sds", title: "10X Tris-Glycine-SDS buffer (SDS PAGE running buffer)" },
    { id: "acrylamide-bisacrylamide", title: "30% Acrylamide / Bisacrylamide solution" },
    { id: "aps", title: "10% APS" },
    { id: "tris-hcl-6-8", title: "0.5 M Tris-HCl, pH 6.8 buffer" },
    { id: "tris-hcl-8-8", title: "1.5 M Tris-HCl, pH 8.8 buffer" },
    { id: "tris-hcl-6-8-loading", title: "1.5 M Tris-HCl pH 6.8 for loading buffer preparation" },
    { id: "sds", title: "10% (w/v) SDS" },
    { id: "coomassie", title: "Coomassie Brilliant Blue Staining solution R-250 (1L)" },
    { id: "gel-fixing", title: "Gel fixing/washing solution (500 ml) (Coomassie Staining)" },
    { id: "dtt", title: "1M 1,4-Dithiothreitol (DDT)" },
    { id: "loading-buffer", title: "Loading Buffer" },
  ]

  // Initialize recipes state with all visible
  const [recipes, setRecipes] = useState<Recipe[]>(recipesList.map((recipe) => ({ ...recipe, visible: true })))

  // Materials state management
  const [buffers, setBuffers] = useState<BufferItem[]>([
    {
      id: "sds-10",
      name: "10% (w/v) SDS",
      checked: true,
      source: "prepare",
      requiredReagents: ["sds-powder"],
    },
    {
      id: "loading-buffer",
      name: "Loading Buffer",
      checked: true,
      source: "prepare",
      requiredReagents: ["tris-hcl-ph68", "glycerol", "sds-powder", "bromophenol-blue"],
    },
    {
      id: "tris-glycine-sds",
      name: "10X Tris-Glycine-SDS buffer (SDS PAGE running buffer)",
      checked: true,
      source: "prepare",
      requiredReagents: ["tris-base", "glycine", "sds-powder"],
    },
    {
      id: "tris-hcl-loading",
      name: "1.5 M Tris-HCl pH 6.8 for loading buffer preparation",
      checked: true,
      source: "prepare",
      requiredReagents: ["tris-base", "hcl"],
    },
    {
      id: "aps",
      name: "10% APS",
      checked: true,
      source: "prepare",
      requiredReagents: ["ammonium-persulfate"],
    },
    {
      id: "coomassie",
      name: "Coomassie Brilliant Blue Staining solution R-250 (1L)",
      checked: true,
      source: "prepare",
      requiredReagents: ["coomassie-r250", "methanol", "acetic-acid"],
    },
    {
      id: "tris-hcl-88",
      name: "1.5 M Tris-HCl, pH 8.8 buffer",
      checked: true,
      source: "prepare",
      requiredReagents: ["tris-base", "hcl"],
    },
    {
      id: "tris-hcl-68",
      name: "0.5 M Tris-HCl, pH 6.8 buffer",
      checked: true,
      source: "prepare",
      requiredReagents: ["tris-base", "hcl"],
    },
    {
      id: "acrylamide-bis",
      name: "30% Acrylamide/Bisacrylamide solution",
      checked: true,
      source: "prepare",
      requiredReagents: ["acrylamide", "bis-acrylamide"],
    },
    {
      id: "gel-fixing",
      name: "Gel fixing/washing solution (500 ml) (Coomassie Staining)",
      checked: true,
      source: "prepare",
      requiredReagents: ["isopropanol", "acetic-acid"],
    },
    {
      id: "dtt",
      name: "1M 1,4-Dithiothreitol (DDT)",
      checked: true,
      source: "prepare",
      requiredReagents: ["dtt-powder"],
    },
    {
      id: "glycerol",
      name: "Glycerol",
      checked: true,
      source: "prepare",
      requiredReagents: ["glycerol"],
    },
    {
      id: "bromophenol-blue",
      name: "Bromophenol Blue",
      checked: true,
      source: "prepare",
      requiredReagents: ["bromophenol-blue"],
    },
  ])

  const [purchasedBuffers, setPurchasedBuffers] = useState<MaterialItem[]>([])

  const [inHouseMaterials, setInHouseMaterials] = useState<MaterialItem[]>([
    { id: "polyacrylamide-gels", name: "Polyacrylamide Protein Gels (Tris-Glycine SDS)", checked: true },
  ])

  const [reagents, setReagents] = useState<MaterialItem[]>([
    { id: "tris-base", name: "Tris base", checked: true },
    { id: "glycine", name: "Glycine", checked: true },
    { id: "sds-powder", name: "SDS (powder)", checked: true },
    { id: "hcl", name: "HCl solution", checked: true },
    { id: "ammonium-persulfate", name: "Ammonium persulfate", checked: true },
    { id: "coomassie-r250", name: "Coomassie Brilliant Blue R-250", checked: true },
    { id: "methanol", name: "Methanol", checked: true },
    { id: "acetic-acid", name: "Acetic acid", checked: true },
    { id: "acrylamide", name: "Acrylamide", checked: true },
    { id: "bis-acrylamide", name: "Bis-acrylamide", checked: true },
    { id: "isopropanol", name: "Isopropanol or ethanol", checked: true },
    { id: "dtt-powder", name: "DTT (1,4-Dithiothreitol)", checked: true },
    { id: "glycerol", name: "Glycerol", checked: true },
    { id: "bromophenol-blue", name: "Bromophenol Blue", checked: true },
    { id: "temed", name: "TEMED", checked: false },
    { id: "protein-markers", name: "Protein molecular weight markers", checked: false },
  ])

  const [supplies, setSupplies] = useState<MaterialItem[]>([
    { id: "pipette-tips", name: "Pipette Tips", checked: true },
    { id: "gloves", name: "Disposable gloves", checked: true },
    { id: "glass-plates", name: "Glass Plates", checked: true },
    { id: "combs", name: "Combs", checked: true },
    { id: "spacers", name: "Spacers", checked: true },
    { id: "beaker", name: "Laboratory Glass Beaker", checked: true },
  ])

  const [equipment, setEquipment] = useState<MaterialItem[]>([
    { id: "electrophoresis-chamber", name: "Electrophoresis Chamber", checked: true },
    { id: "micropipettes", name: "Micropipettes", checked: true },
    { id: "heating-block", name: "Heating block", checked: true },
    { id: "power-supply", name: "Power supply", checked: true },
    { id: "gel-casting-stand", name: "Gel Casting Stand", checked: true },
    { id: "analytical-balance", name: "Analytical balance", checked: true },
    { id: "laboratory-shaker", name: "Laboratory shaker", checked: true },
  ])

  // Product options database
  const productOptions: Record<string, Record<string, ProductOption[]>> = {
    // Buffers
    "tris-glycine-sds": {
      "Sigma-Aldrich": [
        { manufacturer: "Sigma-Aldrich", productName: "10X Tris-Glycine-SDS Buffer", catalogNumber: "T7777" },
        { manufacturer: "Sigma-Aldrich", productName: "Tris-Glycine SDS Running Buffer", catalogNumber: "T4026" },
      ],
      "Thermo Fisher": [
        {
          manufacturer: "Thermo Fisher",
          productName: "Novex Tris-Glycine SDS Running Buffer",
          catalogNumber: "LC2675",
        },
        { manufacturer: "Thermo Fisher", productName: "NuPAGE Tris-Glycine SDS Buffer", catalogNumber: "LC2676" },
      ],
      "Bio-Rad": [
        { manufacturer: "Bio-Rad", productName: "10X Tris/Glycine/SDS Buffer", catalogNumber: "1610732" },
        { manufacturer: "Bio-Rad", productName: "Tris-Glycine Running Buffer", catalogNumber: "1610771" },
      ],
    },
    "loading-buffer": {
      "Thermo Fisher": [
        { manufacturer: "Thermo Fisher", productName: "NuPAGE LDS Sample Buffer", catalogNumber: "NP0007" },
        { manufacturer: "Thermo Fisher", productName: "Bolt LDS Sample Buffer", catalogNumber: "B0007" },
      ],
      "Bio-Rad": [
        { manufacturer: "Bio-Rad", productName: "Laemmli Sample Buffer", catalogNumber: "1610747" },
        { manufacturer: "Bio-Rad", productName: "2X Laemmli Sample Buffer", catalogNumber: "1610737" },
      ],
      "Sigma-Aldrich": [
        { manufacturer: "Sigma-Aldrich", productName: "SDS-PAGE Sample Buffer", catalogNumber: "S3401" },
        { manufacturer: "Sigma-Aldrich", productName: "Laemmli Sample Buffer", catalogNumber: "S3401-10VL" },
      ],
    },
    // Reagents
    "tris-base": {
      "Sigma-Aldrich": [
        { manufacturer: "Sigma-Aldrich", productName: "Tris Base", catalogNumber: "T1503" },
        { manufacturer: "Sigma-Aldrich", productName: "Tris Ultra Pure", catalogNumber: "T5030" },
      ],
      "Thermo Fisher": [
        { manufacturer: "Thermo Fisher", productName: "Tris Base", catalogNumber: "BP152-1" },
        { manufacturer: "Thermo Fisher", productName: "Tris Molecular Biology Grade", catalogNumber: "15504020" },
      ],
      "Bio-Rad": [{ manufacturer: "Bio-Rad", productName: "Tris Base", catalogNumber: "1610716" }],
    },
    glycine: {
      "Sigma-Aldrich": [
        { manufacturer: "Sigma-Aldrich", productName: "Glycine", catalogNumber: "G8898" },
        { manufacturer: "Sigma-Aldrich", productName: "Glycine Electrophoresis Grade", catalogNumber: "G7126" },
      ],
      "Thermo Fisher": [{ manufacturer: "Thermo Fisher", productName: "Glycine", catalogNumber: "BP381-1" }],
      "Bio-Rad": [{ manufacturer: "Bio-Rad", productName: "Glycine", catalogNumber: "1610718" }],
    },
    // Equipment
    "electrophoresis-chamber": {
      "Bio-Rad": [
        { manufacturer: "Bio-Rad", productName: "Mini-PROTEAN Tetra Cell", catalogNumber: "1658004" },
        { manufacturer: "Bio-Rad", productName: "Mini-PROTEAN 3 Cell", catalogNumber: "1658005" },
      ],
      "Thermo Fisher": [
        { manufacturer: "Thermo Fisher", productName: "XCell SureLock Mini-Cell", catalogNumber: "EI0001" },
        { manufacturer: "Thermo Fisher", productName: "Novex Mini-Cell", catalogNumber: "EI9001" },
      ],
      "GE Healthcare": [
        { manufacturer: "GE Healthcare", productName: "SE 260 Mighty Small II", catalogNumber: "80-6418-37" },
      ],
    },
    // Supplies
    "pipette-tips": {
      Eppendorf: [
        { manufacturer: "Eppendorf", productName: "epTIPS Standard Tips", catalogNumber: "0030000870" },
        { manufacturer: "Eppendorf", productName: "epTIPS LoRetention Tips", catalogNumber: "0030014421" },
      ],
      "Thermo Fisher": [
        { manufacturer: "Thermo Fisher", productName: "TipOne Pipette Tips", catalogNumber: "S1111-3700" },
        { manufacturer: "Thermo Fisher", productName: "ART Pipette Tips", catalogNumber: "2069G" },
      ],
      "Bio-Rad": [{ manufacturer: "Bio-Rad", productName: "Micropipette Tips", catalogNumber: "2239803" }],
    },
  }

  // Add brands list for consistent dropdown options
  const availableBrands = [
    "Sigma-Aldrich",
    "Thermo Fisher",
    "Bio-Rad",
    "Eppendorf",
    "GE Healthcare",
    "Merck",
    "Custom / Other",
  ]

  // Helper functions
  const handleBufferSourceChange = (bufferId: string, source: "prepare" | "stock" | "purchase") => {
    setBuffers((prev) =>
      prev.map((buffer) => {
        if (buffer.id === bufferId) {
          const updatedBuffer = { ...buffer, source }

          if (source === "purchase") {
            // Move to purchased buffers
            setPurchasedBuffers((prevPurchased) => [...prevPurchased, { ...updatedBuffer, source: undefined }])
            // Remove required reagents
            if (buffer.requiredReagents) {
              setReagents((prevReagents) =>
                prevReagents.map((reagent) =>
                  buffer.requiredReagents?.includes(reagent.id) ? { ...reagent, checked: false } : reagent,
                ),
              )
            }
            return { ...updatedBuffer, checked: false } // Will be filtered out
          } else if (source === "prepare") {
            // Add required reagents
            if (buffer.requiredReagents) {
              setReagents((prevReagents) =>
                prevReagents.map((reagent) =>
                  buffer.requiredReagents?.includes(reagent.id) ? { ...reagent, checked: true } : reagent,
                ),
              )
            }
            // Remove from purchased if it was there
            setPurchasedBuffers((prevPurchased) => prevPurchased.filter((item) => item.id !== bufferId))
          } else if (source === "stock") {
            // Remove required reagents
            if (buffer.requiredReagents) {
              setReagents((prevReagents) =>
                prevReagents.map((reagent) =>
                  buffer.requiredReagents?.includes(reagent.id) ? { ...reagent, checked: false } : reagent,
                ),
              )
            }
            // Remove from purchased if it was there
            setPurchasedBuffers((prevPurchased) => prevPurchased.filter((item) => item.id !== bufferId))
          }

          return updatedBuffer
        }
        return buffer
      }),
    )
  }

  const handleProductSelection = (
    itemId: string,
    product: ProductOption,
    section: "buffers" | "purchased" | "reagents" | "supplies" | "equipment" | "inhouse",
  ) => {
    const updateFunction = {
      buffers: setBuffers,
      purchased: setPurchasedBuffers,
      reagents: setReagents,
      supplies: setSupplies,
      equipment: setEquipment,
      inhouse: setInHouseMaterials,
    }[section]

    updateFunction((prev: any) => prev.map((item: any) => (item.id === itemId ? { ...item, product } : item)))
  }

  // Parameter management functions
  const handleParameterSave = (parameterId: string, value: number) => {
    setParameters((prev) =>
      prev.map((param) => (param.id === parameterId ? { ...param, selectedValue: value } : param)),
    )
  }

  const getParameterByStep = (stepNumber: number) => {
    return parameters.filter((param) => param.stepNumber === stepNumber)
  }

  const getTheoryHintByStep = (stepNumber: number) => {
    return theoryHints.filter((hint) => hint.stepNumber === stepNumber)
  }

  const toggleRecipeVisibility = (id: string) => {
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) => (recipe.id === id ? { ...recipe, visible: !recipe.visible } : recipe)),
    )
  }

  const updateParameter = (param: string, value: string) => {
    setEditableParams((prev) => ({ ...prev, [param]: value }))
  }

  const calculateBufferAmount = (recipe: BufferRecipe, scaleFactor = 1) => {
    return recipe.components.map((component) => ({
      ...component,
      scaledAmount: component.molWeight
        ? `${(Number.parseFloat(component.amount) * scaleFactor).toFixed(1)} g`
        : component.amount,
    }))
  }

  const tabs = [
    { id: "general-protocol", label: "Protocol" },
    { id: "buffer-recipes", label: "Buffer Recipes" },
    { id: "gel-preparation", label: "Gel Preparation" },
    { id: "materials-list", label: "Materials List" },
    { id: "reference", label: "Reference" },
  ]

  // Step heading component with edit affordance and theory hints in left margin
  const StepHeading = ({ number, children }: { number: number; children: React.ReactNode }) => {
    const theoryHintsForStep = getTheoryHintByStep(number)

    return (
      <div className="relative">
        <div className="flex items-start">
          {/* Theory hints in left margin */}
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
          </h3>
        </div>
      </div>
    )
  }

  // Buffer recipe section component with visibility control
  const BufferRecipeSection = ({
    id,
    title,
    children,
    visible,
  }: {
    id: string
    title: string
    children: React.ReactNode
    visible: boolean
  }) => {
    const sectionId = `recipe-${id}-${uniqueId}`

    return (
      <div
        id={sectionId}
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          visible ? "opacity-100 max-h-[2000px] mb-8" : "opacity-0 max-h-0 m-0",
        )}
        aria-hidden={!visible}
      >
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <div className="space-y-4">{children}</div>
      </div>
    )
  }

  // Recipe item component
  const RecipeItem = ({ children }: { children: React.ReactNode }) => {
    return <div className="border-b border-gray-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">{children}</div>
  }

  // Recipe checkbox component
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

  // Material list item component for consistent styling
  const MaterialListItem = ({
    index,
    name,
    children,
    className,
  }: {
    index: number
    name: string
    children: React.ReactNode
    className?: string
  }) => {
    return (
      <div
        className={cn(
          "py-4 px-4 border-b border-gray-100 last:border-b-0",
          index % 2 === 0 ? "bg-white" : "bg-gray-50",
          className,
        )}
      >
        <div className="grid grid-cols-12 gap-4 items-start">
          <div className="col-span-6 flex items-start">
            <span className="w-6 text-right text-gray-500 mr-3 font-mono text-sm flex-shrink-0 mt-0.5">
              {index + 1}.
            </span>
            <span className="font-medium text-sm leading-relaxed">{name}</span>
          </div>
          <div className="col-span-6 flex justify-end items-start">{children}</div>
        </div>
      </div>
    )
  }

  // Radio button group component
  const RadioButtonGroup = ({
    name,
    value,
    onChange,
    options,
  }: {
    name: string
    value: string
    onChange: (value: string) => void
    options: { value: string; label: string }[]
  }) => {
    return (
      <div className="flex flex-col space-y-2 w-full">
        {options.map((option) => (
          <label key={option.value} className="flex items-center text-sm cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="mr-2 flex-shrink-0"
            />
            <span className="text-sm leading-tight">{option.label}</span>
          </label>
        ))}
      </div>
    )
  }

  // Dual dropdown component for brand and product selection
  const DualDropdownSelector = ({
    itemId,
    section,
    product,
    options,
    placeholder = "Select product",
  }: {
    itemId: string
    section: "buffers" | "purchased" | "reagents" | "supplies" | "equipment" | "inhouse"
    product?: { manufacturer: string; productName: string; catalogNumber: string }
    options?: Record<string, ProductOption[]>
    placeholder?: string
  }) => {
    const [selectedBrand, setSelectedBrand] = useState(product?.manufacturer || "")

    const handleBrandChange = (brand: string) => {
      setSelectedBrand(brand)
      // Reset product when brand changes
      if (brand === "Custom / Other") {
        handleProductSelection(itemId, { manufacturer: brand, productName: "", catalogNumber: "" }, section)
      }
    }

    const handleProductChange = (productKey: string) => {
      if (!options || !selectedBrand) return

      const brandProducts = options[selectedBrand] || []
      const selectedProduct = brandProducts.find((p) => `${p.productName}|${p.catalogNumber}` === productKey)

      if (selectedProduct) {
        handleProductSelection(itemId, selectedProduct, section)
      }
    }

    const availableProducts = options && selectedBrand ? options[selectedBrand] || [] : []

    return (
      <div className="flex items-center gap-2 w-full">
        {/* Brand Dropdown */}
        <select
          value={selectedBrand}
          onChange={(e) => handleBrandChange(e.target.value)}
          className="text-xs border border-gray-300 rounded px-2 py-1 flex-1 min-w-0"
        >
          <option value="">Select brand</option>
          {availableBrands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        {/* Product Dropdown */}
        <select
          value={
            product && selectedBrand === product.manufacturer ? `${product.productName}|${product.catalogNumber}` : ""
          }
          onChange={(e) => handleProductChange(e.target.value)}
          disabled={!selectedBrand || selectedBrand === "Custom / Other"}
          className="text-xs border border-gray-300 rounded px-2 py-1 flex-1 min-w-0 disabled:bg-gray-100"
        >
          <option value="">Select product</option>
          {availableProducts.map((product, idx) => (
            <option key={idx} value={`${product.productName}|${product.catalogNumber}`}>
              {product.productName} ({product.catalogNumber})
            </option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Protocol header with flex layout */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mb-6">
        {/* Title and subtitle group */}
        <div>
          <h1 className="text-2xl font-bold uppercase m-0 leading-tight">Laemmli SDS PAGE Protocol</h1>
          <p className="text-gray-600 mt-0.5 mb-0"></p>
        </div>

        {/* Button group with centered alignment */}
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
          {/* Theory Hints toggle button */}
          <Button
            variant={showTheoryHints ? "default" : "outline"}
            size="sm"
            onClick={() => setShowTheoryHints(!showTheoryHints)}
            className="flex items-center gap-2"
          >
            <Info className="h-4 w-4" />
            Theory hints
          </Button>
        </div>
      </div>

      {/* Secondary Tab Bar */}
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
          {/* Protocol ID pill */}
          <div className="absolute top-6 right-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F3F4F6] text-[#374151]">
              Protocol ID: 89
            </span>
          </div>

          <div className="space-y-8">
            <div>
              <StepHeading number={1}>Preparation of buffers, reagents and stock solutions.</StepHeading>
              <p>
                Check the <em>Buffer &amp; Solution</em> tab and prepare the required solutions and buffers. If
                necessary, adapt the list to suit your laboratory environment.
              </p>
            </div>

            <div>
              <StepHeading number={2}>Prepare the Gel.</StepHeading>
              <p>
                Prepare the gel according to the instructions in the <em>Gel Preparation</em> section.
              </p>
            </div>

            <div>
              <StepHeading number={3}>Quantify the Samples.</StepHeading>
              <p>
                Spectrophotometric determination of protein concentration can be used for quick and rough estimation of
                protein concentration:
              </p>
              <ol className="list-[lower-alpha] pl-5 space-y-2 mt-2">
                <li>
                  Prepare a blank solution (no protein) and measure its absorbance at 280 nm to establish the baseline.
                </li>
                <li>
                  Measure the absorbance (A) at 280 nm for the protein sample using the same cuvette and instrument
                  settings.
                </li>
                <li>
                  Apply the Beer–Lambert law:
                  <br />
                  <code className="block my-2 p-2 bg-gray-50">c = A / (ε × l)</code>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <em>c</em> is the protein concentration.
                    </li>
                    <li>
                      <em>A</em> is the measured absorbance at 280 nm.
                    </li>
                    <li>
                      <em>ε</em> is the extinction coefficient (known or experimentally determined for each protein).
                    </li>
                    <li>
                      <em>l</em> is the path length of the cuvette (typically 1 cm).
                    </li>
                  </ul>
                </li>
              </ol>
            </div>

            <div>
              <StepHeading number={4}>Mix the samples with the Loading buffer.</StepHeading>
              <ol className="list-[lower-alpha] pl-5 space-y-2 mt-2">
                <li>
                  <span className="font-medium">Determine the optimal amount of protein for each well:</span>
                  <p className="mt-1">
                    The amount of sample (in µg) required per well for clearly detectable Coomassie-stained bands
                    depends on the staining procedure and detection method (resulting in a certain sensitivity), the
                    complexity of the sample (e.g. single protein vs. protein mixture) and the gel format (mini-gel vs.
                    standard gel).
                  </p>
                  <p className="mt-1 italic text-gray-600">
                    Typically,{" "}
                    <EditableParameter
                      parameter={parameters.find((p) => p.id === "protein-amount-single")!}
                      onEdit={setEditingParameter}
                    />{" "}
                    of a single purified protein per lane is sufficient for a mini-gel or{" "}
                    <EditableParameter
                      parameter={parameters.find((p) => p.id === "protein-amount-complex")!}
                      onEdit={setEditingParameter}
                    />{" "}
                    for a complex mixture.
                  </p>
                </li>
                <li>
                  <span className="font-medium">Determine the well loading volume:</span>
                  <p className="mt-1">
                    Check the manufacturer's recommendations to determine the well loading volume for your gel.
                  </p>
                  <p className="mt-1 italic text-gray-600">
                    For example, for 1 mm thick gels, the recommended load is{" "}
                    <EditableParameter
                      parameter={parameters.find((p) => p.id === "well-volume-10")!}
                      onEdit={setEditingParameter}
                    />{" "}
                    for 10-well format or{" "}
                    <EditableParameter
                      parameter={parameters.find((p) => p.id === "well-volume-15")!}
                      onEdit={setEditingParameter}
                    />{" "}
                    for 15-well format.
                  </p>
                </li>
                <li>
                  <span className="font-medium">Calculate the required sample volume:</span>
                  <p className="mt-1">
                    Based on the protein concentration and the desired amount of protein per well, calculate the volume
                    of sample needed.
                  </p>
                  <p className="mt-1 italic text-gray-600">
                    For example, if you have a protein concentration of 2 mg/mL and want to load 30 µg per well, you
                    would need 15 µL of sample.
                  </p>
                </li>
                <li>
                  <span className="font-medium">Mix the sample with loading buffer:</span>
                  <p className="mt-1">
                    Mix the calculated volume of sample with an appropriate volume of loading buffer (typically 1:1
                    ratio for 2X loading buffer).
                  </p>
                </li>
              </ol>
            </div>

            <div>
              <StepHeading number={5}>Prepare the Molecular Weight Standards.</StepHeading>
              <p>
                Prepare the molecular weight standards according to the manufacturer's instructions. Typically, this
                involves mixing the standards with loading buffer in the same ratio as your samples.
              </p>
            </div>

            <div>
              <StepHeading number={6}>Heat the samples.</StepHeading>
              <p>
                Heat the samples at{" "}
                <EditableParameter
                  parameter={parameters.find((p) => p.id === "heating-temp")!}
                  onEdit={setEditingParameter}
                />{" "}
                for{" "}
                <EditableParameter
                  parameter={parameters.find((p) => p.id === "heating-time")!}
                  onEdit={setEditingParameter}
                />
                . Cool to room temperature before loading.
              </p>
            </div>

            <div>
              <StepHeading number={7}>Assemble the electrophoresis chamber.</StepHeading>
              <p>
                Remove the gel from the casting stand and assemble it in the electrophoresis chamber according to the
                manufacturer's instructions.
              </p>
            </div>

            <div>
              <StepHeading number={8}>Add running buffer.</StepHeading>
              <p>
                Fill the electrophoresis chamber with 1X running buffer. Make sure the buffer level covers the gel and
                that there are no air bubbles trapped at the bottom of the gel.
              </p>
            </div>

            <div>
              <StepHeading number={9}>Load Samples and Standards.</StepHeading>
              <ol className="list-[lower-alpha] pl-5 space-y-2 mt-2">
                <li>
                  Carefully remove the comb from the gel to create wells. Rinse the wells with running buffer to remove
                  any gel debris.
                </li>
                <li>
                  Load{" "}
                  <EditableParameter
                    parameter={parameters.find((p) => p.id === "standard-volume")!}
                    onEdit={setEditingParameter}
                  />{" "}
                  of molecular weight standards into the first well.
                </li>
                <li>Load your prepared samples into the remaining wells using a micropipette.</li>
                <li>Record the loading order for later reference.</li>
              </ol>
            </div>

            <div>
              <StepHeading number={10}>Run the gel.</StepHeading>
              <ol className="list-[lower-alpha] pl-5 space-y-2 mt-2">
                <li>
                  Connect the electrophoresis chamber to a power supply. Start with{" "}
                  <EditableParameter
                    parameter={parameters.find((p) => p.id === "initial-voltage")!}
                    onEdit={setEditingParameter}
                  />{" "}
                  until the samples enter the resolving gel.
                </li>
                <li>
                  Increase the voltage to{" "}
                  <EditableParameter
                    parameter={parameters.find((p) => p.id === "running-voltage")!}
                    onEdit={setEditingParameter}
                  />{" "}
                  and run until the dye front reaches the bottom of the gel (typically 45-60 minutes for a mini-gel).
                </li>
                <li>Monitor the run to ensure proper separation and that the gel doesn't overheat.</li>
              </ol>
            </div>

            <div>
              <StepHeading number={11}>Stain the Gel.</StepHeading>
              <ol className="list-[lower-alpha] pl-5 space-y-2 mt-2">
                <li>
                  Turn off the power supply and carefully remove the gel from the electrophoresis chamber and glass
                  plates.
                </li>
                <li>
                  Place the gel in fixing solution and incubate for{" "}
                  <EditableParameter
                    parameter={parameters.find((p) => p.id === "fixation-time")!}
                    onEdit={setEditingParameter}
                  />{" "}
                  with gentle shaking.
                </li>
                <li>
                  Transfer the gel to Coomassie Brilliant Blue staining solution and incubate for{" "}
                  <EditableParameter
                    parameter={parameters.find((p) => p.id === "staining-time-min")!}
                    onEdit={setEditingParameter}
                  />{" "}
                  to{" "}
                  <EditableParameter
                    parameter={parameters.find((p) => p.id === "staining-time-max")!}
                    onEdit={setEditingParameter}
                  />{" "}
                  with gentle shaking.
                </li>
                <li>
                  Destain the gel by washing with destaining solution until the background is clear and protein bands
                  are clearly visible.
                </li>
              </ol>
            </div>

            <div>
              <StepHeading number={12}>Document the Gel.</StepHeading>
              <ol className="list-[lower-alpha] pl-5 space-y-2 mt-2">
                <li>
                  Photograph or scan the gel using appropriate documentation equipment. Use{" "}
                  <EditableParameter
                    parameter={parameters.find((p) => p.id === "scan-resolution")!}
                    onEdit={setEditingParameter}
                  />{" "}
                  resolution for publication-quality images.
                </li>
                <li>Include a ruler or size reference in the image for scale.</li>
                <li>Record all relevant experimental conditions and sample information.</li>
              </ol>
            </div>

            <div>
              <StepHeading number={13}>Evaluate the Results.</StepHeading>
              <ol className="list-[lower-alpha] pl-5 space-y-2 mt-2">
                <li>
                  <span className="font-medium">Quick molecular weight estimation:</span>
                  <ol className="list-[lower-roman] pl-5 space-y-1 mt-1">
                    <li>Identify the molecular weight marker bands and their corresponding molecular weights.</li>
                    <li>
                      Measure the migration distance of your protein bands from the top of the resolving gel to the
                      center of each band.
                    </li>
                    <li>
                      Compare the migration distance of your protein bands to the marker bands to estimate molecular
                      weights.
                    </li>
                  </ol>
                </li>
                <li>
                  <span className="font-medium">Assess protein purity and integrity:</span>
                  <ol className="list-[lower-roman] pl-5 space-y-1 mt-1">
                    <li>Single, sharp bands indicate high purity.</li>
                    <li>
                      Multiple bands may indicate protein degradation, contamination, or post-translational
                      modifications.
                    </li>
                    <li>Smearing may indicate protein aggregation or degradation.</li>
                  </ol>
                </li>
                <li>
                  <span className="font-medium">Document your findings:</span>
                  <ol className="list-[lower-roman] pl-5 space-y-1 mt-1">
                    <li>Record estimated molecular weights of observed bands.</li>
                    <li>Note any unusual migration patterns or band characteristics.</li>
                    <li>Compare results to expected molecular weights if known.</li>
                  </ol>
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
              id="tris-glycine-sds"
              title="10X Tris-Glycine-SDS buffer (SDS PAGE running buffer)"
              visible={recipes.find((r) => r.id === "tris-glycine-sds")?.visible || false}
              defaultVolume={1000}
              ingredients={[
                { name: "Tris base", amount: 30.3, unit: "g", molarMass: 121.14 },
                { name: "Glycine", amount: 144, unit: "g", molarMass: 75.07 },
                { name: "SDS", amount: 10, unit: "g", molarMass: 288.38 },
              ]}
              instructions={[
                "1. Dissolve Tris base and glycine in approximately 800 mL of distilled water.",
                "2. Add SDS and mix until completely dissolved.",
                "3. Adjust the final volume to final volume with distilled water.",
                "4. Store at room temperature. Dilute 1:10 with distilled water before use.",
              ]}
            />

            <EnhancedBufferRecipeSection
              id="acrylamide-bisacrylamide"
              title="30% Acrylamide / Bisacrylamide solution"
              visible={recipes.find((r) => r.id === "acrylamide-bisacrylamide")?.visible || false}
              defaultVolume={100}
              ingredients={[
                { name: "Acrylamide", amount: 29.2, unit: "g", molarMass: 71.08 },
                { name: "Bis-acrylamide", amount: 0.8, unit: "g", molarMass: 154.17 },
              ]}
              instructions={[
                "1. Dissolve acrylamide and bis-acrylamide in approximately 80 mL of distilled water.",
                "2. Adjust the final volume to final volume with distilled water.",
                "3. Filter through 0.45 μm filter and store at 4°C in the dark.",
                "4. Use within 1 month. CAUTION: Acrylamide is neurotoxic - handle with care.",
              ]}
            />

            <EnhancedBufferRecipeSection
              id="aps"
              title="10% APS"
              visible={recipes.find((r) => r.id === "aps")?.visible || false}
              defaultVolume={10}
              ingredients={[{ name: "Ammonium persulfate", amount: 1, unit: "g", molarMass: 228.2 }]}
              instructions={[
                "1. Dissolve ammonium persulfate in distilled water to final volume.",
                "2. Prepare fresh weekly and store at 4°C.",
                "3. Use within 1 week for optimal polymerization.",
              ]}
            />

            <EnhancedBufferRecipeSection
              id="tris-hcl-6-8"
              title="0.5 M Tris-HCl, pH 6.8 buffer"
              visible={recipes.find((r) => r.id === "tris-hcl-6-8")?.visible || false}
              defaultVolume={100}
              ingredients={[{ name: "Tris base", amount: 6.06, unit: "g", molarMass: 121.14 }]}
              instructions={[
                "1. Dissolve Tris base in approximately 80 mL of distilled water.",
                "2. Adjust pH to 6.8 with concentrated HCl.",
                "3. Adjust the final volume to final volume with distilled water.",
                "4. Store at 4°C for up to 6 months.",
              ]}
            />

            <EnhancedBufferRecipeSection
              id="tris-hcl-8-8"
              title="1.5 M Tris-HCl, pH 8.8 buffer"
              visible={recipes.find((r) => r.id === "tris-hcl-8-8")?.visible || false}
              defaultVolume={100}
              ingredients={[{ name: "Tris base", amount: 18.17, unit: "g", molarMass: 121.14 }]}
              instructions={[
                "1. Dissolve Tris base in approximately 80 mL of distilled water.",
                "2. Adjust pH to 8.8 with concentrated HCl.",
                "3. Adjust the final volume to final volume with distilled water.",
                "4. Store at 4°C for up to 6 months.",
              ]}
            />

            <EnhancedBufferRecipeSection
              id="tris-hcl-6-8-loading"
              title="1.5 M Tris-HCl pH 6.8 for loading buffer preparation"
              visible={recipes.find((r) => r.id === "tris-hcl-6-8-loading")?.visible || false}
              defaultVolume={10}
              ingredients={[{ name: "Tris base", amount: 1.82, unit: "g", molarMass: 121.14 }]}
              instructions={[
                "1. Dissolve Tris base in approximately 8 mL of distilled water.",
                "2. Adjust pH to 6.8 with concentrated HCl.",
                "3. Adjust the final volume to final volume with distilled water.",
                "4. Store at 4°C for up to 6 months.",
              ]}
            />

            <EnhancedBufferRecipeSection
              id="sds"
              title="10% (w/v) SDS"
              visible={recipes.find((r) => r.id === "sds")?.visible || false}
              defaultVolume={100}
              ingredients={[{ name: "SDS", amount: 10, unit: "g", molarMass: 288.38 }]}
              instructions={[
                "1. Dissolve SDS in distilled water to final volume.",
                "2. Heat gently if necessary to dissolve completely.",
                "3. Store at room temperature.",
                "4. Solution may precipitate at low temperatures - warm to redissolve.",
              ]}
            />

            <EnhancedBufferRecipeSection
              id="coomassie"
              title="Coomassie Brilliant Blue Staining solution R-250 (1L)"
              visible={recipes.find((r) => r.id === "coomassie")?.visible || false}
              defaultVolume={1000}
              ingredients={[
                { name: "Coomassie Brilliant Blue R-250", amount: 1, unit: "g", molarMass: 825.97 },
                { name: "Methanol", amount: 450, unit: "mL", isVolume: true },
                { name: "Acetic acid", amount: 100, unit: "mL", isVolume: true },
              ]}
              instructions={[
                "1. Dissolve Coomassie Brilliant Blue R-250 in methanol.",
                "2. Add acetic acid and mix well.",
                "3. Add distilled water to final volume.",
                "4. Filter through filter paper to remove undissolved dye.",
                "5. Store at room temperature. Can be reused multiple times.",
              ]}
            />

            <EnhancedBufferRecipeSection
              id="gel-fixing"
              title="Gel fixing/washing solution (500 ml) (Coomassie Staining)"
              visible={recipes.find((r) => r.id === "gel-fixing")?.visible || false}
              defaultVolume={500}
              ingredients={[
                { name: "Isopropanol", amount: 125, unit: "mL", isVolume: true, altAmount: 125, altUnit: "mL ethanol" },
                { name: "Acetic acid", amount: 50, unit: "mL", isVolume: true },
              ]}
              instructions={[
                "1. Mix isopropanol (or ethanol) and acetic acid.",
                "2. Add distilled water to final volume.",
                "3. Store at room temperature.",
                "4. Can be reused several times.",
              ]}
            />

            <EnhancedBufferRecipeSection
              id="dtt"
              title="1M 1,4-Dithiothreitol (DDT)"
              visible={recipes.find((r) => r.id === "dtt")?.visible || false}
              defaultVolume={10}
              ingredients={[{ name: "DTT", amount: 1.54, unit: "g", molarMass: 154.25 }]}
              instructions={[
                "1. Dissolve DTT in distilled water to final volume.",
                "2. Filter sterilize through 0.22 μm filter.",
                "3. Aliquot and store at -20°C.",
                "4. Avoid repeated freeze-thaw cycles.",
              ]}
            />

            <EnhancedBufferRecipeSection
              id="loading-buffer"
              title="Loading Buffer"
              visible={recipes.find((r) => r.id === "loading-buffer")?.visible || false}
              defaultVolume={10}
              hasMultipleVariants={true}
              variants={[
                {
                  name: "Non-reducing Loading Buffer (2X)",
                  description: "For analysis under non-reducing conditions",
                  ingredients: [
                    { name: "1.5 M Tris-HCl pH 6.8", amount: 1.25, unit: "mL" },
                    { name: "Glycerol", amount: 2.5, unit: "mL" },
                    { name: "10% SDS", amount: 2, unit: "mL" },
                    { name: "0.5% Bromophenol Blue", amount: 0.2, unit: "mL" },
                  ],
                },
                {
                  name: "Reducing Loading Buffer (2X)",
                  description: "For analysis under reducing conditions",
                  ingredients: [
                    { name: "1.5 M Tris-HCl pH 6.8", amount: 1.25, unit: "mL" },
                    { name: "Glycerol", amount: 2.5, unit: "mL" },
                    { name: "10% SDS", amount: 2, unit: "mL" },
                    { name: "0.5% Bromophenol Blue", amount: 0.2, unit: "mL" },
                    { name: "1M DTT", amount: 0.5, unit: "mL" },
                  ],
                },
              ]}
              instructions={[
                "1. Mix all components in the order listed.",
                "2. Adjust final volume with distilled water.",
                "3. Aliquot and store at -20°C.",
                "4. For reducing buffer, add DTT fresh or store separately and add before use.",
              ]}
            />
          </div>
        </div>
      )}

      {activeTab === "gel-preparation" && (
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Gel Preparation</h2>
          <p className="text-gray-600 mb-6">
            Detailed instructions for preparing polyacrylamide gels for SDS-PAGE analysis.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              <strong>Note:</strong> Gel preparation instructions will be added in a future update. For now, please
              refer to your gel casting system manufacturer's instructions or use pre-cast gels.
            </p>
          </div>
        </div>
      )}

      {activeTab === "materials-list" && (
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Materials List</h2>

          {/* Buffers Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
              Buffers and Solutions ({buffers.filter((b) => b.checked).length})
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {buffers
                .filter((buffer) => buffer.checked)
                .map((buffer, index) => (
                  <MaterialListItem key={buffer.id} index={index} name={buffer.name}>
                    <div className="flex flex-col gap-2 w-full">
                      <RadioButtonGroup
                        name={`buffer-source-${buffer.id}`}
                        value={buffer.source || "prepare"}
                        onChange={(value) =>
                          handleBufferSourceChange(buffer.id, value as "prepare" | "stock" | "purchase")
                        }
                        options={[
                          { value: "prepare", label: "Prepare fresh" },
                          { value: "stock", label: "Use existing stock" },
                          { value: "purchase", label: "Purchase ready-made" },
                        ]}
                      />
                      {buffer.source === "purchase" && (
                        <DualDropdownSelector
                          itemId={buffer.id}
                          section="buffers"
                          product={buffer.product}
                          options={productOptions[buffer.id]}
                        />
                      )}
                    </div>
                  </MaterialListItem>
                ))}
            </div>
          </div>

          {/* Purchased Buffers Section */}
          {purchasedBuffers.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
                Purchased Buffers ({purchasedBuffers.length})
              </h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {purchasedBuffers.map((buffer, index) => (
                  <MaterialListItem key={buffer.id} index={index} name={buffer.name}>
                    <DualDropdownSelector
                      itemId={buffer.id}
                      section="purchased"
                      product={buffer.product}
                      options={productOptions[buffer.id]}
                    />
                  </MaterialListItem>
                ))}
              </div>
            </div>
          )}

          {/* In-house Materials Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
              In-house Materials ({inHouseMaterials.filter((m) => m.checked).length})
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {inHouseMaterials
                .filter((material) => material.checked)
                .map((material, index) => (
                  <MaterialListItem key={material.id} index={index} name={material.name}>
                    <DualDropdownSelector
                      itemId={material.id}
                      section="inhouse"
                      product={material.product}
                      options={productOptions[material.id]}
                    />
                  </MaterialListItem>
                ))}
            </div>
          </div>

          {/* Reagents Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
              Reagents ({reagents.filter((r) => r.checked).length})
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {reagents
                .filter((reagent) => reagent.checked)
                .map((reagent, index) => (
                  <MaterialListItem key={reagent.id} index={index} name={reagent.name}>
                    <DualDropdownSelector
                      itemId={reagent.id}
                      section="reagents"
                      product={reagent.product}
                      options={productOptions[reagent.id]}
                    />
                  </MaterialListItem>
                ))}
            </div>
          </div>

          {/* Supplies Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
              Supplies ({supplies.filter((s) => s.checked).length})
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {supplies
                .filter((supply) => supply.checked)
                .map((supply, index) => (
                  <MaterialListItem key={supply.id} index={index} name={supply.name}>
                    <DualDropdownSelector
                      itemId={supply.id}
                      section="supplies"
                      product={supply.product}
                      options={productOptions[supply.id]}
                    />
                  </MaterialListItem>
                ))}
            </div>
          </div>

          {/* Equipment Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
              Equipment ({equipment.filter((e) => e.checked).length})
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {equipment
                .filter((item) => item.checked)
                .map((item, index) => (
                  <MaterialListItem key={item.id} index={index} name={item.name}>
                    <DualDropdownSelector
                      itemId={item.id}
                      section="equipment"
                      product={item.product}
                      options={productOptions[item.id]}
                    />
                  </MaterialListItem>
                ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "reference" && (
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Reference</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Original Publication</h3>
              <p className="text-gray-700">
                Laemmli, U.K. (1970). Cleavage of structural proteins during the assembly of the head of bacteriophage
                T4. <em>Nature</em>, 227(5259), 680-685.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Key References</h3>
              <ul className="space-y-2 text-gray-700">
                <li>
                  • Gallagher, S.R. (2012). One-dimensional SDS gel electrophoresis of proteins.{" "}
                  <em>Current Protocols in Protein Science</em>, Chapter 10, Unit 10.1.
                </li>
                <li>
                  • Shapiro, A.L., Viñuela, E., & Maizel Jr, J.V. (1967). Molecular weight estimation of polypeptide
                  chains by electrophoresis in SDS-polyacrylamide gels.{" "}
                  <em>Biochemical and Biophysical Research Communications</em>, 28(5), 815-820.
                </li>
                <li>
                  • Weber, K., & Osborn, M. (1969). The reliability of molecular weight determinations by dodecyl
                  sulfate-polyacrylamide gel electrophoresis. <em>Journal of Biological Chemistry</em>, 244(16),
                  4406-4412.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Additional Resources</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Bio-Rad Protein Electrophoresis Technical Handbook</li>
                <li>• Thermo Fisher Scientific Protein Gel Electrophoresis Guide</li>
                <li>• Current Protocols in Protein Science - SDS-PAGE Methods</li>
              </ul>
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
