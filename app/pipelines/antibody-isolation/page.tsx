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
import { PipelinePropertiesPanel } from "@/components/pipeline-properties-panel"

// Pipeline step data
const pipelineSteps = [
  {
    step: 1,
    name: "Centrifugation",
    category: "Separation",
    objective: "Remove cells and large particulates from the culture supernatant.",
    method: "Centrifuge the cell culture medium.",
    ready: true,
    id: "174",
  },
  {
    step: 2,
    name: "Membrane Filtration",
    category: "Separation",
    objective: "Remove fine particulates.",
    method: "Pass supernatant through a membrane filter.",
    ready: true,
    id: "175",
  },
  {
    step: 3,
    name: "Affinity Chromatography",
    category: "Purification",
    objective: "Capture the target antibody.",
    method: "Use a ligand-specific affinity column.",
    ready: true,
    id: "176",
  },
  {
    step: 4,
    name: "Concentration (Centrifugal Filters)",
    category: "Purification",
    objective: "Concentrate the antibody preparation.",
    method: "Spin down sample using centrifugal filters.",
    ready: true,
    id: "177",
  },
  {
    step: 5,
    name: "UV280 Measurement",
    category: "Analysis",
    objective: "Determine antibody concentration.",
    method: "Use spectrophotometer at 280 nm.",
    ready: true,
    id: "178",
  },
  {
    step: 6,
    name: "SDS-PAGE",
    category: "Analysis",
    objective: "Assess purity and molecular weight.",
    method: "Run gel electrophoresis.",
    ready: true,
    id: "179",
  },
]

// Methods data - same as in new-pipeline-editor.tsx
const availableMethods = [
  {
    id: "pcr",
    name: "PCR",
    description: "Polymerase Chain Reaction for DNA amplification",
  },
  {
    id: "sds-page",
    name: "SDS-PAGE",
    description: "Sodium Dodecyl Sulfate Polyacrylamide Gel Electrophoresis for protein separation",
  },
  {
    id: "lcms",
    name: "LC/MS",
    description: "Liquid Chromatography-Mass Spectrometry for molecular analysis",
  },
  {
    id: "elisa",
    name: "ELISA",
    description: "Enzyme-Linked Immunosorbent Assay for detecting antibodies or antigens",
  },
  {
    id: "centrifugation",
    name: "Centrifugation",
    description: "Separate components by centrifugal force",
  },
  {
    id: "membrane-filtration",
    name: "Membrane Filtration",
    description: "Filter particles through membrane",
  },
  {
    id: "affinity-chromatography",
    name: "Affinity Chromatography",
    description: "Purify using specific binding interactions",
  },
  {
    id: "uv280-measurement",
    name: "UV280 Measurement",
    description: "Measure protein concentration",
  },
  {
    id: "concentration",
    name: "Concentration (Centrifugal Filters)",
    description: "Concentrate samples using centrifugal force",
  },
]

// Custom modules data - same as in new-pipeline-editor.tsx
const availableModules = [
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
  {
    id: "reporting",
    name: "Reporting",
    description: "Generate automated reports",
  },
]

export default function AntibodyIsolationPipeline() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"visual" | "list">("visual")
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null)
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false)
  const [isMethodsDropdownOpen, setIsMethodsDropdownOpen] = useState(false)
  const [isModulesDropdownOpen, setIsModulesDropdownOpen] = useState(false)
  const [isModulesExpanded, setIsModulesExpanded] = useState(true)

  // Get the current view from URL params
  useEffect(() => {
    const view = searchParams.get("view")
    if (view === "list") {
      setViewMode("list")
    } else {
      setViewMode("visual")
    }
  }, [searchParams])

  // Handle view mode toggle
  const handleViewModeToggle = (mode: "visual" | "list") => {
    setViewMode(mode)
    router.push(`/pipelines/antibody-isolation?view=${mode}`)
  }

  // Handle step selection
  const handleSelectStep = (id: string) => {
    setSelectedStepId(id)
    setShowPropertiesPanel(true)
  }

  // Get the selected step data
  const selectedStep = pipelineSteps.find((step) => step.id === selectedStepId)

  // Convert step to block format for properties panel
  const selectedBlock = selectedStep
    ? {
        id: selectedStep.id,
        type: "method",
        name: selectedStep.name,
        description: selectedStep.objective,
        position: { x: 0, y: 0 },
        ready: selectedStep.ready,
        stepNumber: selectedStep.step.toString(),
      }
    : null

  // Handle block update
  const handleUpdateBlock = (id: string, data: any) => {
    // In a real app, this would update the step data
    console.log("Update block", id, data)
  }

  // Handle method selection from dropdown
  const handleMethodSelect = (methodId: string) => {
    console.log(`Selected method: ${methodId}`)
    setIsMethodsDropdownOpen(false)
  }

  // Handle module selection from dropdown
  const handleModuleSelect = (moduleId: string) => {
    console.log(`Selected module: ${moduleId}`)
    setIsModulesDropdownOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex">
        {/* Left Sidebar - matching the New Pipeline page */}
        {viewMode === "visual" && (
          <div className="w-64 border-r border-gray-200 flex flex-col">
            {/* Methods Dropdown */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center mb-2">
                <FlaskRound className="h-4 w-4 mr-2" />
                <span className="font-medium">Methods</span>
              </div>

              {/* Custom Select implementation to always show placeholder */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsMethodsDropdownOpen(!isMethodsDropdownOpen)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  aria-haspopup="listbox"
                  aria-expanded={isMethodsDropdownOpen}
                  data-method-select
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
                  {/* Custom Select implementation to always show placeholder */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsModulesDropdownOpen(!isModulesDropdownOpen)}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                      aria-haspopup="listbox"
                      aria-expanded={isModulesDropdownOpen}
                      data-module-select
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
          {/* Reduced height header - 56px tall */}
          <div className="border-b border-gray-200">
            <div className="w-full flex justify-between items-center px-6 h-14 flex-nowrap">
              <div className="flex items-center min-w-0 flex-1 mr-4">
                <h1
                  className="text-xl font-bold py-4 truncate max-w-full"
                  title="Antibody Isolation from Cell Culture Supernatant Under Laboratory Conditions"
                >
                  Antibody Isolation from Cell Culture Supernatant Under Laboratory Conditions
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
                    onSelectStep={handleSelectStep}
                    selectedStepId={selectedStepId}
                  />
                </div>
              )}
            </div>

            {/* Properties Panel - Show in both views */}
            {showPropertiesPanel && selectedBlock && (
              <div className="w-80 border-l border-gray-200">
                <PipelinePropertiesPanel
                  block={selectedBlock}
                  onUpdateBlock={handleUpdateBlock}
                  onClose={() => {
                    setShowPropertiesPanel(false)
                    setSelectedStepId(null)
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
