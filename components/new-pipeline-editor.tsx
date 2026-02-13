"use client"

import type React from "react"

import { useState } from "react"
import { Pencil, Save, Share2, Play, Layers, FlaskRound, LayoutGrid, List, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { PipelineCanvas, type BlockData, type ConnectionData } from "./pipeline-canvas"
import { PipelineListView } from "./pipeline-list-view"

export function NewPipelineEditor() {
  const [pipelineName, setPipelineName] = useState("New Pipeline")
  const [isEditingName, setIsEditingName] = useState(false)
  const [isModulesExpanded, setIsModulesExpanded] = useState(true)
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false)
  const [isMethodsDropdownOpen, setIsMethodsDropdownOpen] = useState(false)
  const [isModulesDropdownOpen, setIsModulesDropdownOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"visual" | "list">("visual")
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)

  // Pipeline state
  const [blocks, setBlocks] = useState<BlockData[]>([])
  const [connections, setConnections] = useState<ConnectionData[]>([])

  // Methods data
  const [availableMethods, setAvailableMethods] = useState([
    {
      id: "rna-isolation",
      name: "RNA Isolation",
      description: "Extraction of total RNA from biological samples",
    },
    {
      id: "reverse-transcription",
      name: "Reverse Transcription (RT)",
      description: "cDNA synthesis from RNA templates",
    },
    {
      id: "qpcr",
      name: "qPCR (Quantitative PCR)",
      description: "Real-time PCR for quantifying nucleic acids",
    },
    {
      id: "endpoint-pcr",
      name: "End-point PCR",
      description: "Standard PCR for DNA amplification and downstream analysis",
    },
    {
      id: "agarose-gel",
      name: "Agarose Gel Electrophoresis",
      description: "Separation of DNA or RNA fragments using agarose gel",
    },
    {
      id: "sds-page",
      name: "SDS-PAGE",
      description: "Sodium Dodecyl Sulfate Polyacrylamide Gel Electrophoresis for protein separation",
    },
  ])

  // Selected methods (added to pipeline)
  const [selectedMethods, setSelectedMethods] = useState<
    Array<{
      id: string
      name: string
      description: string
    }>
  >([])

  // Custom modules data
  const [availableModules, setAvailableModules] = useState([
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
  ])

  // Selected modules (added to pipeline)
  const [selectedModules, setSelectedModules] = useState<
    Array<{
      id: string
      name: string
      description: string
    }>
  >([])

  // Helper functions for data transformation
  const getCategoryFromType = (type: string) => {
    switch (type) {
      case "RNA Isolation":
        return "Extraction"
      case "Reverse Transcription (RT)":
        return "Synthesis"
      case "qPCR (Quantitative PCR)":
      case "End-point PCR":
        return "Amplification"
      case "Agarose Gel Electrophoresis":
        return "Analysis"
      case "SDS-PAGE":
        return "Separation"
      default:
        return "General"
    }
  }

  const getObjectiveFromType = (type: string) => {
    switch (type) {
      case "RNA Isolation":
        return "Extract total RNA from biological samples"
      case "Reverse Transcription (RT)":
        return "Synthesize cDNA from RNA templates"
      case "qPCR (Quantitative PCR)":
        return "Quantify nucleic acids in real-time"
      case "End-point PCR":
        return "Amplify DNA for downstream analysis"
      case "Agarose Gel Electrophoresis":
        return "Separate DNA/RNA fragments by size"
      case "SDS-PAGE":
        return "Separate proteins by molecular weight"
      default:
        return "Perform laboratory procedure"
    }
  }

  const getMethodFromType = (type: string) => {
    switch (type) {
      case "RNA Isolation":
        return "Column-based or TRIzol extraction"
      case "Reverse Transcription (RT)":
        return "Reverse transcriptase enzyme reaction"
      case "qPCR (Quantitative PCR)":
        return "Real-time PCR with fluorescent detection"
      case "End-point PCR":
        return "Standard PCR amplification"
      case "Agarose Gel Electrophoresis":
        return "Electrophoretic separation in agarose matrix"
      case "SDS-PAGE":
        return "Polyacrylamide gel electrophoresis"
      default:
        return "Standard laboratory protocol"
    }
  }

  // Transform blocks to steps format for list view
  const transformedSteps =
    blocks?.map((block, index) => ({
      step: index + 1,
      name: block.name,
      category: getCategoryFromType(block.name),
      objective: getObjectiveFromType(block.name),
      method: getMethodFromType(block.name),
      ready: block.ready || false,
      id: block.id,
    })) || []

  const handleNameEdit = () => {
    setIsEditingName(true)
  }

  const handleNameSave = () => {
    setIsEditingName(false)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPipelineName(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNameSave()
    }
  }

  // Handle method selection from dropdown
  const handleMethodSelect = (methodId: string) => {
    // Find the selected method
    const selectedMethod = availableMethods.find((method) => method.id === methodId)
    if (selectedMethod) {
      // Add to selected methods
      setSelectedMethods([...selectedMethods, selectedMethod])
      // Remove from available methods
      setAvailableMethods(availableMethods.filter((method) => method.id !== methodId))
      // Close the dropdown and reset to placeholder
      setIsMethodsDropdownOpen(false)
    }
  }

  // Handle module selection from dropdown
  const handleModuleSelect = (moduleId: string) => {
    // Find the selected module
    const selectedModule = availableModules.find((module) => module.id === moduleId)
    if (selectedModule) {
      // Add to selected modules
      setSelectedModules([...selectedModules, selectedModule])
      // Remove from available modules
      setAvailableModules(availableModules.filter((module) => module.id !== moduleId))
      // Close the dropdown and reset to placeholder
      setIsModulesDropdownOpen(false)
    }
  }

  // Make items draggable from the sidebar
  const handleDragStart = (
    e: React.DragEvent,
    item: { id: string; type: "method" | "module"; name: string; description: string },
  ) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item))
    e.dataTransfer.effectAllowed = "copy"
  }

  // Canvas event handlers
  const handleAddBlock = (block: BlockData) => {
    setBlocks([...blocks, block])
    setSelectedBlockId(block.id)
    setShowPropertiesPanel(true)
  }

  const handleUpdateBlock = (id: string, data: Partial<BlockData>) => {
    setBlocks(blocks.map((block) => (block.id === id ? { ...block, ...data } : block)))
  }

  const handleRemoveBlock = (id: string) => {
    // Remove the block
    setBlocks(blocks.filter((block) => block.id !== id))

    // Remove any connections involving this block
    setConnections(connections.filter((conn) => conn.sourceId !== id && conn.targetId !== id))

    // If this was the selected block, deselect it
    if (selectedBlockId === id) {
      setSelectedBlockId(null)
      setShowPropertiesPanel(false)
    }

    // Return the method or module to the available list
    const removedBlock = blocks.find((block) => block.id === id)
    if (removedBlock) {
      if (removedBlock.type === "method") {
        // Extract the original method ID from the block ID (e.g., "pcr-12345" -> "pcr")
        const originalId = removedBlock.id.split("-")[0]

        // Add back to available methods
        setAvailableMethods([
          ...availableMethods,
          {
            id: originalId,
            name: removedBlock.name,
            description: removedBlock.description,
          },
        ])
      } else {
        // Extract the original module ID from the block ID
        const originalId = removedBlock.id.split("-")[0]

        // Add back to available modules
        setAvailableModules([
          ...availableModules,
          {
            id: originalId,
            name: removedBlock.name,
            description: removedBlock.description,
          },
        ])
      }
    }
  }

  const handleAddConnection = (connection: ConnectionData) => {
    // Check if connection already exists
    const exists = connections.some(
      (conn) => conn.sourceId === connection.sourceId && conn.targetId === connection.targetId,
    )

    if (!exists) {
      setConnections([...connections, connection])
    }
  }

  const handleRemoveConnection = (id: string) => {
    setConnections(connections.filter((conn) => conn.id !== id))
  }

  const handleSelectBlock = (id: string | null) => {
    setSelectedBlockId(id)
    setShowPropertiesPanel(!!id)
  }

  const handleReorderBlocks = (newBlocks: BlockData[]) => {
    setBlocks(newBlocks)
  }

  // Get the selected block
  const selectedBlock = blocks.find((block) => block.id === selectedBlockId) || null

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="w-full flex justify-between items-center px-6 h-16">
          <div className="flex items-center">
            {isEditingName ? (
              <Input
                value={pipelineName}
                onChange={handleNameChange}
                onBlur={handleNameSave}
                onKeyDown={handleKeyDown}
                autoFocus
                className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 p-0 h-auto"
              />
            ) : (
              <h1 className="text-2xl font-bold flex items-center">
                {pipelineName}
                <button
                  onClick={handleNameEdit}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  aria-label="Edit pipeline name"
                >
                  <Pencil className="h-5 w-5" />
                </button>
              </h1>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* View toggle */}
            <div className="flex items-center border border-gray-200 rounded-md overflow-hidden mr-2">
              <button
                className={cn(
                  "px-3 py-1.5 flex items-center",
                  viewMode === "visual" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-600",
                )}
                onClick={() => setViewMode("visual")}
              >
                <LayoutGrid className="h-4 w-4 mr-1" />
                <span className="text-sm">Visual</span>
              </button>
              <button
                className={cn(
                  "px-3 py-1.5 flex items-center",
                  viewMode === "list" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-600",
                )}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 mr-1" />
                <span className="text-sm">List</span>
              </button>
            </div>

            <Button variant="outline" size="sm" className="h-9">
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <Button size="sm" className="h-9 bg-black hover:bg-gray-800">
              <Play className="mr-2 h-4 w-4" /> Run Pipeline
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Sidebar */}
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 opacity-50"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {isMethodsDropdownOpen && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white p-1 text-gray-950 shadow-md">
                  <ul className="py-1" role="listbox">
                    {availableMethods.length > 0 ? (
                      availableMethods.map((method) => (
                        <li
                          key={method.id}
                          role="option"
                          className="relative flex w-full cursor-default select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100"
                          onClick={() => handleMethodSelect(method.id)}
                          draggable
                          onDragStart={(e) => handleDragStart(e, { ...method, type: "method" })}
                        >
                          <div>
                            <div className="font-medium">{method.name}</div>
                            <div className="text-xs text-gray-500">{method.description}</div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="relative flex w-full cursor-default select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none text-gray-500">
                        No methods available
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Display selected methods */}
            {selectedMethods.length > 0 && (
              <div className="mt-3 space-y-2">
                {selectedMethods.map((method) => (
                  <div
                    key={method.id}
                    className="p-2 bg-gray-50 rounded-md cursor-grab"
                    draggable
                    onDragStart={(e) => handleDragStart(e, { ...method, type: "method" })}
                  >
                    <div className="font-medium text-sm">{method.name}</div>
                    <div className="text-xs text-gray-500">{method.description}</div>
                  </div>
                ))}
              </div>
            )}
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 opacity-50"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {isModulesDropdownOpen && (
                    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white p-1 text-gray-950 shadow-md">
                      <ul className="py-1" role="listbox">
                        {availableModules.length > 0 ? (
                          availableModules.map((module) => (
                            <li
                              key={module.id}
                              role="option"
                              className="relative flex w-full cursor-default select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100"
                              onClick={() => handleModuleSelect(module.id)}
                              draggable
                              onDragStart={(e) => handleDragStart(e, { ...module, type: "module" })}
                            >
                              <div>
                                <div className="font-medium">{module.name}</div>
                                <div className="text-xs text-gray-500">{module.description}</div>
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="relative flex w-full cursor-default select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none text-gray-500">
                            No modules available
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Display selected modules */}
                {selectedModules.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {selectedModules.map((module) => (
                      <div
                        key={module.id}
                        className="p-2 bg-gray-50 rounded-md cursor-grab"
                        draggable
                        onDragStart={(e) => handleDragStart(e, { ...module, type: "module" })}
                      >
                        <div className="font-medium text-sm">{module.name}</div>
                        <div className="text-xs text-gray-500">{module.description}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Canvas or List View */}
          <div className="flex-1">
            {viewMode === "visual" ? (
              <PipelineCanvas
                blocks={blocks}
                connections={connections}
                onAddBlock={handleAddBlock}
                onUpdateBlock={handleUpdateBlock}
                onRemoveBlock={handleRemoveBlock}
                onAddConnection={handleAddConnection}
                onRemoveConnection={handleRemoveConnection}
                onSelectBlock={handleSelectBlock}
                selectedBlockId={selectedBlockId}
              />
            ) : (
              <PipelineListView
                steps={transformedSteps}
                onRemoveBlock={handleRemoveBlock}
                onReorderBlocks={handleReorderBlocks}
                onSelectBlock={handleSelectBlock}
                selectedBlockId={selectedBlockId}
              />
            )}
          </div>

          {/* Properties Panel */}
          {showPropertiesPanel && selectedBlock && (
            <div className="w-80 border-l border-gray-200 bg-white p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Properties</h3>
                <button
                  onClick={() => {
                    setShowPropertiesPanel(false)
                    setSelectedBlockId(null)
                  }}
                  className="p-1 rounded-sm hover:bg-gray-100 text-gray-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 flex-1 overflow-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input
                    value={selectedBlock.name}
                    onChange={(e) => handleUpdateBlock(selectedBlock.id, { name: e.target.value })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={selectedBlock.description}
                    onChange={(e) => handleUpdateBlock(selectedBlock.id, { description: e.target.value })}
                    className="w-full min-h-[100px] rounded-md border border-gray-200 p-2"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="ready-status"
                    checked={selectedBlock.ready || false}
                    onChange={(e) => handleUpdateBlock(selectedBlock.id, { ready: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <label htmlFor="ready-status" className="font-medium">
                    Mark as Ready
                  </label>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-gray-500 mb-1">Block Type</p>
                  <p className="text-sm font-medium">{selectedBlock.type === "method" ? "Method" : "Module"}</p>
                </div>

                {selectedBlock.stepNumber && (
                  <div className="pt-2">
                    <p className="text-xs text-gray-500 mb-1">Step Number</p>
                    <p className="text-sm font-medium">{selectedBlock.stepNumber}</p>
                  </div>
                )}

                <div className="pt-2">
                  <p className="text-xs text-gray-500 mb-1">ID</p>
                  <p className="text-sm">{selectedBlock.id.split("-")[1]?.substring(0, 3) || "0"}</p>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-gray-500 mb-1">Position</p>
                  <div className="flex space-x-2">
                    <div>
                      <p className="text-xs text-gray-500">X</p>
                      <p className="text-sm">{Math.round(selectedBlock.position.x)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Y</p>
                      <p className="text-sm">{Math.round(selectedBlock.position.y)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
