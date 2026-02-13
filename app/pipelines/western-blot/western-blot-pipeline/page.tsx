"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { StaticPipelineCanvas } from "@/components/static-pipeline-canvas"
import { PipelineListView } from "@/components/pipeline-list-view"
import { Button } from "@/components/ui/button"
import { Download, Share2, LayoutGrid, List, Play, FlaskRound, Layers, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import {
  ParametersModal,
  ProtocolModal,
  BufferRecipesModal,
  CalculationsModal,
  MaterialsModal,
  WesternBlotParametersModal,
  WesternBlotMaterialsModal,
} from "@/components/pipeline-modals"
import { WesternBlotPlanOverlay } from "@/components/western-blot-plan-overlay"
import { CustomModulePlanOverlay } from "@/components/custom-module-plan-overlay"
import { CustomModuleProtocolOverlay } from "@/components/custom-module-protocol-overlay"

// Pipeline step data for Western Blot Pipeline
const pipelineSteps = [
  {
    step: 1,
    name: "Whole-cell protein lysate preparation using detergent-based buffer",
    category: "Sample Preparation",
    objective: "Lyse cells and extract total protein from suspension cell culture.",
    method: "Custom Module",
    ready: false,
    id: "wb-step-1",
    protocolId: "CM-001",
    parametersState: "none" as const,
    dateSelected: "2025-03-25",
    author: "Dr. Johnson",
  },
  {
    step: 2,
    name: "UV Protein Concentration Measurement",
    category: "Analysis",
    objective: "Determine protein concentration using UV spectrophotometry.",
    method: "Standard Method",
    ready: true,
    id: "wb-step-2",
    protocolId: "#401",
    parametersState: "selected" as const,
    dateSelected: "2025-03-25",
    author: "Dr. Johnson",
  },
  {
    step: 3,
    name: "SDS-PAGE",
    category: "Analysis",
    objective: "Separate proteins by molecular weight using gel electrophoresis.",
    method: "Standard Method",
    ready: true,
    id: "wb-step-3",
    protocolId: "#303",
    parametersState: "configured" as const,
    dateSelected: "2025-03-18",
    author: "Dr. Johnson",
  },
  {
    step: 4,
    name: "Western Blot",
    category: "Analysis",
    objective: "Detect specific proteins using antibody-based detection.",
    method: "Standard Method",
    ready: true,
    id: "wb-step-4",
    protocolId: "#402",
    parametersState: "configured" as const,
    dateSelected: "2025-03-25",
    author: "Dr. Johnson",
  },
]

// Methods data
const availableMethods = [
  {
    id: "western-blot",
    name: "Western Blot",
    description: "Antibody-based protein detection technique",
  },
  {
    id: "sds-page",
    name: "SDS-PAGE",
    description: "Sodium Dodecyl Sulfate Polyacrylamide Gel Electrophoresis for protein separation",
  },
  {
    id: "uv-protein-measurement",
    name: "UV Protein Concentration Measurement",
    description: "Measure protein concentration using UV spectrophotometry",
  },
  {
    id: "elisa",
    name: "ELISA",
    description: "Enzyme-Linked Immunosorbent Assay for detecting antibodies or antigens",
  },
]

// Custom modules data
const availableModules = [
  {
    id: "whole-cell-lysate-prep",
    name: "Whole-cell protein lysate preparation using detergent-based buffer",
    description: "Extract total protein from suspension cell culture",
  },
  {
    id: "data-analysis",
    name: "Data Analysis",
    description: "Statistical analysis of experimental data",
  },
  {
    id: "visualization",
    name: "Visualization",
    description: "Data visualization tools",
  },
]

export default function WesternBlotPipelinePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"visual" | "list">("list")
  const [isMethodsDropdownOpen, setIsMethodsDropdownOpen] = useState(false)
  const [isModulesDropdownOpen, setIsModulesDropdownOpen] = useState(false)
  const [isModulesExpanded, setIsModulesExpanded] = useState(true)

  // Modal state management
  const [modalState, setModalState] = useState<{
    type: "parameters" | "protocol" | "buffers" | "calculations" | "materials" | "western-blot-parameters" | null
    step: any | null
  }>({
    type: null,
    step: null,
  })

  const [updatedStepId, setUpdatedStepId] = useState<string | null>(null)

  // State for Western Blot Plan overlay
  const [showWesternBlotPlan, setShowWesternBlotPlan] = useState(false)
  const [westernBlotSelections, setWesternBlotSelections] = useState<Record<string, boolean>>({})

  // State for Western Blot Materials modal
  const [showWesternBlotMaterials, setShowWesternBlotMaterials] = useState(false)

  // State for Custom Module Plan overlay
  const [showCustomModulePlan, setShowCustomModulePlan] = useState(false)
  const [customModuleSelections, setCustomModuleSelections] = useState<Record<string, boolean>>({})
  const [customModuleVariation, setCustomModuleVariation] = useState("suspension")

  // State for Custom Module Protocol overlay
  const [showCustomModuleProtocol, setShowCustomModuleProtocol] = useState(false)
  const [customModuleProtocolParams, setCustomModuleProtocolParams] = useState<Record<string, number>>({})

  // Get the current view from URL params
  useEffect(() => {
    const view = searchParams.get("view")
    if (view === "visual") {
      setViewMode("visual")
    } else {
      setViewMode("list")
    }
  }, [searchParams])

  // Handle view mode toggle
  const handleViewModeToggle = (mode: "visual" | "list") => {
    setViewMode(mode)
    router.push(`/pipelines/western-blot/western-blot-pipeline?view=${mode}`)
  }

  // Modal handlers
  const handleParametersClick = (step: any) => {
    if (step.name === "Western Blot") {
      // Open the Western Blot Parameters modal with full parameter table
      setModalState({ type: "western-blot-parameters", step })
    } else {
      // Open the regular parameters modal for other steps
      setModalState({ type: "parameters", step })
    }
  }

  const handleProtocolClick = (step: any) => {
    setModalState({ type: "protocol", step })
  }

  const handleBuffersClick = (step: any) => {
    setModalState({ type: "buffers", step })
  }

  const handleCalculationsClick = (step: any) => {
    setModalState({ type: "calculations", step })
  }

  const handleMaterialsClick = (step: any) => {
    if (step.name === "Western Blot") {
      setShowWesternBlotMaterials(true)
    } else {
      setModalState({ type: "materials", step })
    }
  }

  const closeModal = () => {
    setModalState({ type: null, step: null })
    setShowWesternBlotMaterials(false)
    setShowCustomModulePlan(false)
    setShowCustomModuleProtocol(false)
  }

  const handleApplyParameters = (data: any) => {
    console.log("[v0] Applying parameters:", data)
    if (modalState.step) {
      setUpdatedStepId(modalState.step.id)
      // Clear the "Updated" indicator after 3 seconds
      setTimeout(() => {
        setUpdatedStepId(null)
      }, 3000)
    }
  }

  const handleApplyWesternBlotParameters = (parameters: any) => {
    console.log("[v0] Applying Western Blot parameters:", parameters)
    if (modalState.step) {
      setUpdatedStepId(modalState.step.id)
      // Clear the "Updated" indicator after 3 seconds
      setTimeout(() => {
        setUpdatedStepId(null)
      }, 3000)
    }
  }

  // Handler for opening Western Blot Plan overlay
  const handlePlanClick = (step: any) => {
    if (step.name === "Western Blot") {
      setShowWesternBlotPlan(true)
    } else if (step.name === "Whole-cell protein lysate preparation using detergent-based buffer") {
      setShowCustomModulePlan(true)
    }
  }

  // Handler for applying Western Blot Plan selections
  const handleApplyWesternBlotPlan = (selections: Record<string, boolean>) => {
    console.log("[v0] Applying Western Blot Plan selections:", selections)
    setWesternBlotSelections(selections)

    // Find the Western Blot step and mark it as updated
    const westernBlotStep = pipelineSteps.find((s) => s.name === "Western Blot")
    if (westernBlotStep) {
      setUpdatedStepId(westernBlotStep.id)
      // Clear the "Updated" indicator after 3 seconds
      setTimeout(() => {
        setUpdatedStepId(null)
      }, 3000)
    }
  }

  // Handler for applying Custom Module Plan selections
  const handleApplyCustomModulePlan = (selections: Record<string, boolean>, variation: string) => {
    console.log("[v0] Applying Custom Module Plan selections:", selections, "variation:", variation)
    setCustomModuleSelections(selections)
    setCustomModuleVariation(variation)

    // Find the custom module step and mark it as updated
    const customModuleStep = pipelineSteps.find(
      (s) => s.name === "Whole-cell protein lysate preparation using detergent-based buffer",
    )
    if (customModuleStep) {
      setUpdatedStepId(customModuleStep.id)
      setTimeout(() => {
        setUpdatedStepId(null)
      }, 3000)
    }
  }

  // Handler for saving custom module protocol parameters
  const handleSaveCustomModuleProtocol = (parameters: Record<string, number>) => {
    console.log("[v0] Saving Custom Module Protocol parameters:", parameters)
    setCustomModuleProtocolParams(parameters)

    // Find the custom module step and mark it as updated
    const customModuleStep = pipelineSteps.find(
      (s) => s.name === "Whole-cell protein lysate preparation using detergent-based buffer",
    )
    if (customModuleStep) {
      setUpdatedStepId(customModuleStep.id)
      setTimeout(() => {
        setUpdatedStepId(null)
      }, 3000)
    }
  }

  // Handle block update
  const handleUpdateBlock = (id: string, data: any) => {
    console.log("Update block", id, data)
  }

  // Handle method selection
  const handleMethodSelect = (id: string) => {
    console.log("Method selected:", id)
  }

  // Handle module selection
  const handleModuleSelect = (id: string) => {
    console.log("Module selected:", id)
  }

  // Handler for Protocol ID click
  const handleProtocolIdClick = (step: any) => {
    if (step.protocolId === "CM-001") {
      setShowCustomModuleProtocol(true)
    }
  }

  const handleApplyWesternBlotMaterials = () => {
    console.log("[v0] Applying Western Blot materials")
    // Logic to apply Western Blot materials
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex">
        {/* Left Sidebar */}
        {viewMode === "visual" && (
          <div className="w-64 border-r border-gray-200 flex flex-col">
            {/* Methods Dropdown */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center mb-2">
                <FlaskRound className="h-4 w-4 mr-2" />
                <span className="font-medium">Methods</span>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsMethodsDropdownOpen(!isMethodsDropdownOpen)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  aria-haspopup="listbox"
                  aria-expanded={isMethodsDropdownOpen}
                >
                  <span className="text-gray-500">Select a method...</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>

                {isMethodsDropdownOpen && (
                  <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white p-1 text-gray-950 shadow-md">
                    <ul className="py-1" role="listbox">
                      {availableMethods.map((method) => (
                        <li
                          key={method.id}
                          role="option"
                          className="relative flex w-full cursor-default select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100"
                          onClick={() => handleMethodSelect(method.id)}
                        >
                          <div>
                            <div className="font-medium">{method.name}</div>
                            <div className="text-xs text-gray-500">{method.description}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Custom Modules Section */}
            <div className="border-b border-gray-200">
              <button
                className="w-full px-4 py-3 flex items-center justify-between text-left"
                onClick={() => setIsModulesExpanded(!isModulesExpanded)}
              >
                <div className="flex items-center">
                  <Layers className="h-4 w-4 mr-2" />
                  <span className="font-medium">Custom Modules</span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={cn("transition-transform", isModulesExpanded ? "rotate-180" : "")}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {isModulesExpanded && (
                <div className="px-4 pb-4">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsModulesDropdownOpen(!isModulesDropdownOpen)}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                      aria-haspopup="listbox"
                      aria-expanded={isModulesDropdownOpen}
                    >
                      <span className="text-gray-500">Select a module...</span>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </button>

                    {isModulesDropdownOpen && (
                      <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white p-1 text-gray-950 shadow-md">
                        <ul className="py-1" role="listbox">
                          {availableModules.map((module) => (
                            <li
                              key={module.id}
                              role="option"
                              className="relative flex w-full cursor-default select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100"
                              onClick={() => handleModuleSelect(module.id)}
                            >
                              <div>
                                <div className="font-medium">{module.name}</div>
                                <div className="text-xs text-gray-500">{module.description}</div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col">
          {/* Breadcrumb */}
          <div className="px-6 pt-4 pb-2 text-sm text-gray-600 border-b border-gray-200">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <span className="mx-2">›</span>
            <Link href="/pipelines" className="hover:text-gray-900">
              Pipelines
            </Link>
            <span className="mx-2">›</span>
            <Link href="/pipelines/western-blot" className="hover:text-gray-900">
              Western Blot
            </Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Western Blot Pipeline</span>
          </div>

          {/* Header */}
          <div className="border-b border-gray-200">
            <div className="w-full flex justify-between items-center px-6 h-14 flex-nowrap">
              <div className="flex items-center min-w-0 flex-1 mr-4">
                <h1 className="text-xl font-bold py-4 truncate max-w-full" title="Western Blot Pipeline">
                  Western Blot Pipeline
                </h1>
              </div>

              <div className="flex items-center space-x-3 flex-nowrap flex-shrink-0">
                {/* View toggle */}
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                  <button
                    className={cn(
                      "px-3 py-1.5 flex items-center",
                      viewMode === "visual" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-600",
                    )}
                    onClick={() => handleViewModeToggle("visual")}
                  >
                    <LayoutGrid className="h-4 w-4 mr-1" />
                    <span className="text-sm">Visual</span>
                  </button>
                  <button
                    className={cn(
                      "px-3 py-1.5 flex items-center",
                      viewMode === "list" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-600",
                    )}
                    onClick={() => handleViewModeToggle("list")}
                  >
                    <List className="h-4 w-4 mr-1" />
                    <span className="text-sm">List</span>
                  </button>
                </div>

                <Button variant="outline" size="sm" className="h-9 bg-transparent">
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
                <Button variant="outline" size="sm" className="h-9 bg-transparent">
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
                <Button size="sm" className="h-9 bg-black hover:bg-gray-800">
                  <Play className="mr-2 h-4 w-4" /> Run Pipeline
                </Button>
              </div>
            </div>
          </div>

          {/* Pipeline Content */}
          <div className="flex-1 flex">
            {/* Main Content Area */}
            <div className="flex-1 relative">
              {viewMode === "visual" ? (
                <StaticPipelineCanvas />
              ) : (
                <div className="px-0">
                  <PipelineListView
                    steps={pipelineSteps}
                    onParametersClick={handleParametersClick}
                    onProtocolClick={handleProtocolIdClick}
                    onBuffersClick={handleBuffersClick}
                    onCalculationsClick={handleCalculationsClick}
                    onMaterialsClick={handleMaterialsClick}
                    onPlanClick={handlePlanClick}
                    updatedStepId={updatedStepId}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {modalState.type === "western-blot-parameters" && modalState.step && (
        <WesternBlotParametersModal isOpen={true} onClose={closeModal} onApply={handleApplyWesternBlotParameters} />
      )}

      {modalState.type === "parameters" && modalState.step && (
        <ParametersModal
          isOpen={true}
          onClose={closeModal}
          stepName={modalState.step.name}
          isEditable={modalState.step.step === 1}
          onApply={modalState.step.step === 1 ? handleApplyParameters : undefined}
        />
      )}

      {modalState.type === "protocol" && modalState.step && (
        <ProtocolModal
          isOpen={true}
          onClose={closeModal}
          stepName={modalState.step.name}
          protocolText={`1. Prepare RIPA buffer and chill on ice
2. Collect suspension cells by centrifugation
3. Wash cells with PBS
4. Add lysis buffer and incubate on ice
5. Optional: Freeze samples at –70 °C
6. Clarify lysate by centrifugation
7. Collect supernatant (whole-cell lysate)`}
        />
      )}

      {modalState.type === "buffers" && modalState.step && (
        <BufferRecipesModal
          isOpen={true}
          onClose={closeModal}
          stepName={modalState.step.name}
          buffers={[
            {
              name: "RIPA Buffer",
              components: [
                { component: "Tris-HCl (pH 7.4)", concentration: "50 mM", volume: "5 ml" },
                { component: "NaCl", concentration: "150 mM", volume: "8.77 g/L" },
                { component: "NP-40", concentration: "1%", volume: "10 ml" },
                { component: "Sodium deoxycholate", concentration: "0.5%", volume: "5 g/L" },
              ],
            },
            {
              name: "PBS",
              components: [
                { component: "NaCl", concentration: "137 mM", volume: "8 g/L" },
                { component: "KCl", concentration: "2.7 mM", volume: "0.2 g/L" },
                { component: "Na₂HPO₄", concentration: "10 mM", volume: "1.44 g/L" },
              ],
            },
          ]}
        />
      )}

      {modalState.type === "calculations" && modalState.step && (
        <CalculationsModal
          isOpen={true}
          onClose={closeModal}
          stepName={modalState.step.name}
          calculations={[
            {
              label: "Lysis Buffer Volume",
              value: "1 ml",
              description: "For 0.5-5 × 10⁷ cells",
            },
            {
              label: "Centrifugation Force",
              value: "450 ×g",
              description: "Gentle centrifugation for 5 minutes",
            },
            {
              label: "Expected Protein Yield",
              value: "~200 µg",
              description: "Estimated from 1 × 10⁷ cells",
            },
          ]}
        />
      )}

      {modalState.type === "materials" && modalState.step && (
        <MaterialsModal
          isOpen={true}
          onClose={closeModal}
          stepName={modalState.step.name}
          materials={{
            reagents: [
              "RIPA buffer or NP-40 buffer",
              "Protease/phosphatase inhibitor cocktail",
              "PBS (phosphate-buffered saline)",
            ],
            consumables: ["15 ml centrifuge tubes", "1.5 ml microcentrifuge tubes", "Pipette tips"],
            equipment: ["Refrigerated centrifuge", "Ice bucket", "Pipettes", "Vortex mixer (optional)"],
          }}
        />
      )}

      {/* Western Blot Materials modal */}
      {showWesternBlotMaterials && (
        <WesternBlotMaterialsModal
          isOpen={true}
          onClose={closeModal}
          onApply={handleApplyWesternBlotMaterials}
          planSelections={westernBlotSelections}
        />
      )}

      {/* Western Blot Plan overlay */}
      <WesternBlotPlanOverlay
        isOpen={showWesternBlotPlan}
        onClose={() => setShowWesternBlotPlan(false)}
        onApply={handleApplyWesternBlotPlan}
        initialSelections={westernBlotSelections}
      />

      {/* Custom Module Plan overlay */}
      <CustomModulePlanOverlay
        isOpen={showCustomModulePlan}
        onClose={() => setShowCustomModulePlan(false)}
        onApply={handleApplyCustomModulePlan}
        initialSelections={customModuleSelections}
        initialVariation={customModuleVariation}
      />

      {/* Custom Module Protocol overlay */}
      <CustomModuleProtocolOverlay
        isOpen={showCustomModuleProtocol}
        onClose={() => setShowCustomModuleProtocol(false)}
        onSave={handleSaveCustomModuleProtocol}
        initialParameters={customModuleProtocolParams}
      />
    </div>
  )
}
