"use client"

import { useState, useMemo } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SDSPagePreparationModalProps {
  isOpen: boolean
  onClose: () => void
}

// Constants for well volume calculation
const WELL_WIDTH = 5 // mm
const GEL_HEIGHT = 40 // mm

// Gel size options
const gelSizeOptions = [
  { value: "mini", label: "mini (8–10 × 6–9 cm)" },
  { value: "midi", label: "midi (10–14 × 8–10 cm)" },
  { value: "large", label: "large (14–20 × 10–19 cm)" },
]

// Number of wells based on gel size
const wellOptionsBySize: Record<string, number[]> = {
  mini: [8, 9, 10, 11, 12, 13, 14, 15],
  midi: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
  large: Array.from({ length: 29 }, (_, i) => 20 + i), // 20-48
}

// Thickness options
const thicknessOptions = [0.75, 1.0, 1.5, 2.0]

// Protein size options with mappings
const proteinSizeOptions = [
  { value: "<10", label: "<10 kDa (peptides)", gelPercentage: 20, crossLink: "19:1 (5% cross-linker)" },
  { value: "10-60", label: "10–60 kDa", gelPercentage: 15, crossLink: "29.1:1 (3.3% cross-linker)" },
  { value: "30-100", label: "30–100 kDa", gelPercentage: 12, crossLink: "29.1:1 (3.3% cross-linker)" },
  { value: "50-150", label: "50–150 kDa", gelPercentage: 10, crossLink: "29.1:1 (3.3% cross-linker)" },
  { value: "100-200", label: "100–200 kDa", gelPercentage: 7.5, crossLink: "37.5:1 (2.7% cross-linker)" },
  { value: ">200", label: ">200 kDa", gelPercentage: 5, crossLink: "37.5:1 (2.7% cross-linker)" },
]

// Protocol steps
const protocolSteps = [
  { id: 1, title: "Prepare resolving gel solution", description: "Mix acrylamide, buffer, water, and SDS according to calculated volumes" },
  { id: 2, title: "Add APS and TEMED", description: "Add ammonium persulfate and TEMED to initiate polymerization" },
  { id: 3, title: "Pour resolving gel", description: "Carefully pour the gel solution between glass plates" },
  { id: 4, title: "Overlay with isopropanol", description: "Add isopropanol layer to ensure flat gel surface" },
  { id: 5, title: "Prepare stacking gel", description: "Mix stacking gel components after resolving gel polymerizes" },
  { id: 6, title: "Insert comb and allow polymerization", description: "Insert well comb and wait for complete polymerization" },
]

export function SDSPagePreparationModal({ isOpen, onClose }: SDSPagePreparationModalProps) {
  // Configuration state
  const [gelSize, setGelSize] = useState("mini")
  const [numberOfWells, setNumberOfWells] = useState(10)
  const [thickness, setThickness] = useState(1.0)
  const [proteinSize, setProteinSize] = useState("30-100")
  const [gelPercentage, setGelPercentage] = useState(12)

  // Get available wells for current gel size
  const availableWells = wellOptionsBySize[gelSize] || wellOptionsBySize.mini

  // Calculate well volume: well_width × thickness × gel_height × 0.001
  const wellVolume = useMemo(() => {
    return Math.round(WELL_WIDTH * thickness * GEL_HEIGHT)
  }, [thickness])

  // Get cross-linking ratio based on protein size
  const crossLinkingRatio = useMemo(() => {
    const option = proteinSizeOptions.find(opt => opt.value === proteinSize)
    return option?.crossLink || "29.1:1 (3.3% cross-linker)"
  }, [proteinSize])

  // Handle gel size change - reset wells to first available option
  const handleGelSizeChange = (newSize: string) => {
    setGelSize(newSize)
    const newWells = wellOptionsBySize[newSize] || wellOptionsBySize.mini
    if (!newWells.includes(numberOfWells)) {
      setNumberOfWells(newWells[0])
    }
  }

  // Handle protein size change - auto-update gel percentage
  const handleProteinSizeChange = (newSize: string) => {
    setProteinSize(newSize)
    const option = proteinSizeOptions.find(opt => opt.value === newSize)
    if (option) {
      setGelPercentage(option.gelPercentage)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-[900px] max-h-[90vh] overflow-y-auto mx-4">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">SDS-PAGE Gel Preparation</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Configure gel parameters for polyacrylamide gel electrophoresis
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="px-6 py-6">
          {/* ── Configuration Header ──────────────────────────────── */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Gel Configuration</h2>
            
            {/* Row 1: Gel size and wells */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="gel-size" className="text-sm font-medium text-gray-700">
                  Gel Size
                </Label>
                <Select value={gelSize} onValueChange={handleGelSizeChange}>
                  <SelectTrigger id="gel-size" className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {gelSizeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wells" className="text-sm font-medium text-gray-700">
                  Number of Wells
                </Label>
                <Select value={String(numberOfWells)} onValueChange={(v) => setNumberOfWells(Number(v))}>
                  <SelectTrigger id="wells" className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableWells.map(n => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Thickness and well volume */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="thickness" className="text-sm font-medium text-gray-700">
                  Thickness, mm
                </Label>
                <Select value={String(thickness)} onValueChange={(v) => setThickness(Number(v))}>
                  <SelectTrigger id="thickness" className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {thicknessOptions.map(t => (
                      <SelectItem key={t} value={String(t)}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="well-volume" className="text-sm font-medium text-gray-700">
                  Well Volume
                </Label>
                <Input
                  id="well-volume"
                  value={`${wellVolume} µl`}
                  readOnly
                  className="bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Row 3: Protein parameters */}
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="protein-size" className="text-sm font-medium text-gray-700">
                  Protein / peptide size
                </Label>
                <Select value={proteinSize} onValueChange={handleProteinSizeChange}>
                  <SelectTrigger id="protein-size" className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {proteinSizeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gel-percentage" className="text-sm font-medium text-gray-700">
                  Gel Percentage (%)
                </Label>
                <Input
                  id="gel-percentage"
                  type="number"
                  value={gelPercentage}
                  onChange={(e) => setGelPercentage(Number(e.target.value))}
                  className="bg-white"
                  step={0.5}
                  min={5}
                  max={20}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cross-linking" className="text-sm font-medium text-gray-700">
                  Cross-linking Ratio
                </Label>
                <Input
                  id="cross-linking"
                  value={crossLinkingRatio}
                  readOnly
                  className="bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* ── Protocol Steps ─────────────────────────────────────── */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Protocol Steps — SDS-PAGE Gel Preparation
            </h2>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {protocolSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-start gap-4 px-4 py-4 ${
                    index < protocolSteps.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                    {step.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900">{step.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Actions ────────────────────────────────────────────── */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="outline">
              Save as Draft
            </Button>
            <Button onClick={onClose}>
              Apply Configuration
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
