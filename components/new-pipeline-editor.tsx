"use client"

import type React from "react"

import { useState } from "react"
import { Pencil, Save, Share2, Play, LayoutGrid, List, X, Search, Plus, Filter, Grid3X3, Package, FlaskConical, CalendarDays, User, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { PipelineCanvas, type BlockData, type ConnectionData } from "./pipeline-canvas"
import { PipelineListView } from "./pipeline-list-view"
import { ParametersModal, BufferRecipesModal, MaterialsModal } from "./pipeline-modals"
import { WesternBlotPlanOverlay } from "./western-blot-plan-overlay"
import { CustomModulePlanOverlay } from "./custom-module-plan-overlay"

interface NewPipelineEditorProps {
  hideHeader?: boolean
  viewMode?: "visual" | "list"
  onViewModeChange?: (mode: "visual" | "list") => void
  onClose?: () => void
}

export function NewPipelineEditor({ hideHeader, viewMode: externalViewMode, onViewModeChange, onClose }: NewPipelineEditorProps = {}) {
  const [pipelineName, setPipelineName] = useState("New Pipeline")
  const [isEditingName, setIsEditingName] = useState(false)
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false)
  const [internalViewMode, setInternalViewMode] = useState<"visual" | "list">("visual")
  const viewMode = externalViewMode ?? internalViewMode
  const setViewMode = (mode: "visual" | "list") => {
    setInternalViewMode(mode)
    onViewModeChange?.(mode)
  }
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [sidebarTab, setSidebarTab] = useState<"methods" | "custom-modules">("methods")
  const [searchQuery, setSearchQuery] = useState("")
  const [modalState, setModalState] = useState<{ type: "parameters" | "buffers" | "materials" | "plan-western-blot" | "plan-custom-module" | null; stepName?: string }>({ type: null })
  const closeModal = () => setModalState({ type: null })

  const openModalForStep = (type: "parameters" | "buffers" | "materials", stepName: string) =>
    setModalState({ type, stepName })
  const openPlanForStep = (stepName: string) =>
    setModalState({ type: stepName === "Western Blot" ? "plan-western-blot" : "plan-custom-module", stepName })

  // Pipeline state
  const [blocks, setBlocks] = useState<BlockData[]>([])
  const [connections, setConnections] = useState<ConnectionData[]>([])

  // Static library data (items stay visible after being added to the pipeline)
  const allMethods = [
    { id: "rna-isolation", name: "RNA Isolation", description: "Extraction of total RNA from biological samples" },
    { id: "reverse-transcription", name: "Reverse Transcription (RT)", description: "cDNA synthesis from RNA templates" },
    { id: "qpcr", name: "qPCR (Quantitative PCR)", description: "Real-time PCR for quantifying nucleic acids" },
    { id: "endpoint-pcr", name: "End-point PCR", description: "Standard PCR for DNA amplification" },
    { id: "agarose-gel", name: "Agarose Gel Electrophoresis", description: "Separation of DNA or RNA fragments by size" },
    { id: "sds-page", name: "SDS-PAGE", description: "Polyacrylamide gel electrophoresis for protein separation" },
  ]

  const allCustomModules = [
    { id: "CM-001", name: "Whole-Cell Protein Lysate Preparation", description: "Lysate preparation from suspension cells prior to Western blot" },
    { id: "data-analysis", name: "Data Analysis", description: "Statistical analysis of experimental data" },
    { id: "visualization", name: "Visualization", description: "Data visualization tools" },
    { id: "reporting", name: "Reporting", description: "Generate automated reports" },
  ]

  const sidebarItems = sidebarTab === "methods" ? allMethods : allCustomModules
  const filteredItems = searchQuery.trim()
    ? sidebarItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sidebarItems

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

  // Add an item directly to the canvas (click + button)
  const handleAddItem = (item: { id: string; name: string; description: string }, type: "method" | "module") => {
    const col = blocks.length % 3
    const row = Math.floor(blocks.length / 3)
    const block: BlockData = {
      id: `${item.id}-${Date.now()}`,
      type,
      name: item.name,
      description: item.description,
      position: { x: 80 + col * 220, y: 80 + row * 140 },
      ready: false,
    }
    handleAddBlock(block)
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
    setBlocks(blocks.filter((block) => block.id !== id))
    setConnections(connections.filter((conn) => conn.sourceId !== id && conn.targetId !== id))
    if (selectedBlockId === id) {
      setSelectedBlockId(null)
      setShowPropertiesPanel(false)
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

  const handleStepsReorder = (newSteps: Array<{ id: string }>) => {
    const reordered = newSteps
      .map(step => blocks.find(b => b.id === step.id))
      .filter((b): b is BlockData => !!b)
    setBlocks(reordered)
  }

  // Get the selected block
  const selectedBlock = blocks.find((block) => block.id === selectedBlockId) || null

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      {!hideHeader && <div className="border-b border-gray-200">
        <div className="w-full flex justify-between items-center px-6 h-16">
          <div className="flex items-center gap-3">
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 transition-colors"
                aria-label="Back to pipelines"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
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
      </div>}

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Sidebar — methods & modules picker */}
        <div className="w-64 border-r border-gray-200 flex flex-col">
          {/* Sidebar header: search + tabs */}
          <div className="px-3 pt-4 pb-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">Add Steps</p>

            {/* Search */}
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black bg-white"
              />
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-md p-0.5">
              <button
                className={cn(
                  "flex-1 text-xs py-1.5 rounded font-medium transition-colors",
                  sidebarTab === "methods"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
                onClick={() => { setSidebarTab("methods"); setSearchQuery("") }}
              >
                Methods
              </button>
              <button
                className={cn(
                  "flex-1 text-xs py-1.5 rounded font-medium transition-colors",
                  sidebarTab === "custom-modules"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
                onClick={() => { setSidebarTab("custom-modules"); setSearchQuery("") }}
              >
                Op. Proc.
              </button>
            </div>
          </div>

          {/* Item list */}
          <div className="flex-1 overflow-y-auto py-2">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group mx-2 mb-0.5 px-3 py-2.5 rounded-lg hover:bg-gray-50 cursor-grab flex items-start justify-between gap-2 transition-colors"
                  draggable
                  onDragStart={(e) => handleDragStart(e, { ...item, type: sidebarTab === "methods" ? "method" : "module" })}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 leading-snug">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-snug">{item.description}</p>
                  </div>
                  <button
                    className="shrink-0 mt-0.5 w-5 h-5 rounded flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-all"
                    onClick={() => handleAddItem(item, sidebarTab === "methods" ? "method" : "module")}
                    title="Add to pipeline"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 text-center py-10">No results</p>
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
                showStepConnector
                hideColumns={['status', 'action']}
                onReorder={handleStepsReorder}
                onPlanClick={step => openPlanForStep(step.name)}
                onParametersClick={step => openModalForStep("parameters", step.name)}
                onMaterialsClick={step => openModalForStep("materials", step.name)}
                onBuffersClick={step => openModalForStep("buffers", step.name)}
              />
            )}
          </div>

          {/* Properties Panel */}
          {showPropertiesPanel && selectedBlock && viewMode === "visual" && (
            <div className="w-72 border-l border-gray-200 bg-white flex flex-col overflow-y-auto">
              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    {selectedBlock.type === "method" ? "Method" : "Module"}
                    {selectedBlock.stepNumber ? ` · Step ${selectedBlock.stepNumber}` : ""}
                  </p>
                  <h3 className="text-sm font-semibold text-gray-900 mt-0.5">{selectedBlock.name}</h3>
                </div>
                <button
                  onClick={() => { setShowPropertiesPanel(false); setSelectedBlockId(null) }}
                  className="p-1 rounded hover:bg-gray-100 text-gray-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 px-4 py-4 space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Name</label>
                  <Input
                    value={selectedBlock.name}
                    onChange={(e) => handleUpdateBlock(selectedBlock.id, { name: e.target.value })}
                    className="w-full h-8 text-sm"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Description</label>
                  <textarea
                    value={selectedBlock.description}
                    onChange={(e) => handleUpdateBlock(selectedBlock.id, { description: e.target.value })}
                    rows={3}
                    className="w-full text-sm rounded-md border border-gray-200 px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100" />

                {/* Action buttons — same as list view columns */}
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Actions</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => openPlanForStep(selectedBlock.name)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Filter className="h-3.5 w-3.5 shrink-0" />
                      Plan
                    </button>
                    <button
                      onClick={() => openModalForStep("parameters", selectedBlock.name)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Grid3X3 className="h-3.5 w-3.5 shrink-0" />
                      Parameters
                    </button>
                    <button
                      onClick={() => openModalForStep("materials", selectedBlock.name)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Package className="h-3.5 w-3.5 shrink-0" />
                      Materials
                    </button>
                    <button
                      onClick={() => openModalForStep("buffers", selectedBlock.name)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <FlaskConical className="h-3.5 w-3.5 shrink-0" />
                      Buffers
                    </button>
                  </div>
                </div>

                {/* Metadata fields */}
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1.5">
                      Protocol ID
                    </label>
                    <Input placeholder="e.g. #101" className="h-8 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1.5">
                      <CalendarDays className="h-3 w-3" /> Date Selected
                    </label>
                    <Input type="date" className="h-8 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1.5">
                      <User className="h-3 w-3" /> Author
                    </label>
                    <Input placeholder="e.g. Dr. Smith" className="h-8 text-sm" />
                  </div>
                </div>

                {/* Ready toggle */}
                <div className="border-t border-gray-100 pt-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="ready-status"
                    checked={selectedBlock.ready || false}
                    onChange={(e) => handleUpdateBlock(selectedBlock.id, { ready: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <label htmlFor="ready-status" className="text-sm font-medium text-gray-700">
                    Mark as Ready
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {modalState.type === "parameters" && modalState.stepName && (
        <ParametersModal
          isOpen
          onClose={closeModal}
          stepName={modalState.stepName}
          isEditable
          onApply={closeModal}
        />
      )}
      {modalState.type === "buffers" && modalState.stepName && (
        <BufferRecipesModal
          isOpen
          onClose={closeModal}
          stepName={modalState.stepName}
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
      {modalState.type === "materials" && modalState.stepName && (
        <MaterialsModal
          isOpen
          onClose={closeModal}
          stepName={modalState.stepName}
          materials={{
            reagents: ["RIPA buffer or NP-40 buffer", "Protease/phosphatase inhibitor cocktail", "PBS"],
            consumables: ["15 ml centrifuge tubes", "1.5 ml microcentrifuge tubes", "Pipette tips"],
            equipment: ["Refrigerated centrifuge", "Ice bucket", "Pipettes", "Vortex mixer"],
          }}
        />
      )}
      <WesternBlotPlanOverlay
        isOpen={modalState.type === "plan-western-blot"}
        onClose={closeModal}
        onApply={closeModal}
      />
      <CustomModulePlanOverlay
        isOpen={modalState.type === "plan-custom-module"}
        onClose={closeModal}
        onApply={closeModal}
      />
    </div>
  )
}
