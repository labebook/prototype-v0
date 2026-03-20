"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  ChevronRight,
  Copy,
  Edit,
  FileText,
  Folder,
  Paperclip,
  Pencil,
  Play,
  Share2,
  User,
  UserMinus,
  UserPlus,
} from "lucide-react"
import { PipelineListView } from "@/components/pipeline-list-view"
import { ParametersModal, BufferRecipesModal, MaterialsModal } from "@/components/pipeline-modals"
import { WesternBlotPlanOverlay } from "@/components/western-blot-plan-overlay"
import { CustomModulePlanOverlay } from "@/components/custom-module-plan-overlay"
import { ModuleInputDialog } from "@/components/module-input-dialog"
import { ModuleExecutionDialog } from "@/components/module-execution-dialog"
import { ModuleOutputDialog } from "@/components/module-output-dialog"
import { useTeam } from "@/hooks/useTeam"
import { getUserById } from "@/lib/mockData"
import Link from "next/link"

type Tab = "steps" | "attachments" | "activity"

interface ModuleData {
  inputData: { text: string; files: File[] }
  outputData: { text: string; files: File[] }
  checkedSteps: string[]
  startedAt?: string
  completedAt?: string
  inputUser?: string
  outputUser?: string
}

export default function ProjectPipelineDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string
  const pipelineId = params.pipelineId as string

  const [activeTab, setActiveTab] = useState<Tab>("steps")
  const { currentTeam, currentUser, pipelines, pipelineFolders, projects, canEdit, getProjectActivities, renamePipeline, updatePipelineDescription } = useTeam()

  const [currentExecutingModule, setCurrentExecutingModule] = useState<string | null>(null)
  const [workflowStep, setWorkflowStep] = useState<"input" | "execution" | "output" | null>(null)
  const [moduleDataMap, setModuleDataMap] = useState<Record<string, ModuleData>>({})
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set())
  const [isMounted, setIsMounted] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState("")
  const [editingDescription, setEditingDescription] = useState(false)
  const [descGoal, setDescGoal] = useState("")
  const [stepModal, setStepModal] = useState<{ type: "parameters" | "buffers" | "materials" | "plan-western-blot" | "plan-custom-module" | null; stepName?: string }>({ type: null })
  const closeStepModal = () => setStepModal({ type: null })
  const openModalForStep = (type: "parameters" | "buffers" | "materials", stepName: string) => setStepModal({ type, stepName })
  const openPlanForStep = (stepName: string) => setStepModal({ type: stepName === "Western Blot" ? "plan-western-blot" : "plan-custom-module", stepName })

  useEffect(() => { setIsMounted(true) }, [])

  if (!currentTeam) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">No Team Selected</h2>
              <p className="text-gray-600">Please select a team to view pipelines</p>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    )
  }

  const project = projects.find(p => p.id === projectId)
  const pipeline = pipelines.find(p => p.id === pipelineId)

  if (!project || !pipeline) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">
                {!project ? "Project Not Found" : "Pipeline Not Found"}
              </h2>
              <p className="text-gray-600 mb-6">The page you're looking for doesn't exist</p>
              <Button onClick={() => router.push("/projects")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Button>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    )
  }

  const folder = pipeline.folderId ? pipelineFolders.find(f => f.id === pipeline.folderId) : null
  const owner = getUserById(pipeline.ownerId)
  const lastModifiedBy = pipeline.lastModifiedBy ? getUserById(pipeline.lastModifiedBy) : null
  const canEditPipeline = canEdit("pipeline", pipeline.id)

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
    })

  const isFirstStep = (stepId: string) => pipelineSteps[0]?.id === stepId

  const handleRunStep = (stepId: string) => {
    setCurrentExecutingModule(stepId)
    // First step shows input; subsequent steps skip straight to output
    setWorkflowStep(isFirstStep(stepId) ? "input" : "output")
  }

  const nowLabel = () =>
    new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })

  const handleInputContinue = (data: { text: string; files: File[] }) => {
    if (currentExecutingModule) {
      setModuleDataMap(prev => ({
        ...prev,
        [currentExecutingModule]: {
          ...prev[currentExecutingModule],
          inputData: data,
          outputData: prev[currentExecutingModule]?.outputData ?? { text: "", files: [] },
          checkedSteps: prev[currentExecutingModule]?.checkedSteps ?? [],
          startedAt: prev[currentExecutingModule]?.startedAt ?? nowLabel(),
          inputUser: prev[currentExecutingModule]?.inputUser ?? currentUser.name,
        },
      }))
      setCurrentExecutingModule(null)
      setWorkflowStep(null)
    }
  }

  const handleExecutionComplete = (checkedSteps: string[]) => {
    if (currentExecutingModule) {
      setModuleDataMap(prev => ({
        ...prev,
        [currentExecutingModule]: { ...prev[currentExecutingModule], checkedSteps },
      }))
      setWorkflowStep("output")
    }
  }

  const handleOutputComplete = (data: { text: string; files: File[] }) => {
    if (currentExecutingModule) {
      setModuleDataMap(prev => ({
        ...prev,
        [currentExecutingModule]: {
          ...prev[currentExecutingModule],
          outputData: data,
          completedAt: nowLabel(),
          outputUser: currentUser.name,
        },
      }))
      setCompletedModules(prev => new Set([...prev, currentExecutingModule]))
      setCurrentExecutingModule(null)
      setWorkflowStep(null)
    }
  }

  function handleTitleEditOpen() {
    setTitleValue(pipeline.name)
    setEditingTitle(true)
  }
  function handleTitleSave() {
    const trimmed = titleValue.trim()
    if (trimmed) renamePipeline(pipelineId, trimmed)
    setEditingTitle(false)
  }
  function handleDescriptionEditOpen() {
    setDescGoal(pipeline.description.goal ?? "")
    setEditingDescription(true)
  }
  function handleDescriptionSave() {
    updatePipelineDescription(pipelineId, { goal: descGoal, context: "" })
    setEditingDescription(false)
  }

  const pipelineSteps = [
    {
      id: "step-1", step: 1, name: "Whole-Cell Protein Lysate Preparation Using Detergent-Based Buffer", category: "method",
      objective: "Prepare whole-cell lysates using a detergent-based lysis buffer",
      method: "Detergent-based cell lysis protocol", ready: true,
      protocolId: "protocol-1", parametersState: "configured" as const,
      dateSelected: "2025-02-01", author: owner?.name || "Unknown",
      executionStatus: completedModules.has("step-1") ? "completed" : "idle",
      isSubStep: false,
      executionSteps: [
        { id: "step-1-1", title: "Harvest cells", description: "Collect cells from culture dishes" },
        { id: "step-1-2", title: "Wash cells with PBS", description: "Remove culture medium" },
        { id: "step-1-3", title: "Add lysis buffer", description: "Use RIPA or similar detergent-based buffer" },
        { id: "step-1-4", title: "Incubate on ice", description: "30 minutes with occasional vortexing" },
        { id: "step-1-5", title: "Centrifuge lysate", description: "14,000g for 15 min at 4°C" },
        { id: "step-1-6", title: "Collect supernatant", description: "Transfer to fresh tube" },
      ],
    },
    {
      id: "step-2", step: 2, name: "BCA Protein Assay", category: "method",
      objective: "Quantify total protein concentration using a BCA assay",
      method: "Bicinchoninic acid protein quantification", ready: true,
      protocolId: "protocol-2", parametersState: "configured" as const,
      dateSelected: "2025-02-01", author: owner?.name || "Unknown",
      executionStatus: completedModules.has("step-2") ? "completed" : "idle",
      isSubStep: false,
      executionSteps: [
        { id: "step-2-1", title: "Prepare protein standards", description: "BSA dilution series" },
        { id: "step-2-2", title: "Prepare BCA working reagent", description: "Mix reagent A and B" },
        { id: "step-2-3", title: "Add samples to plate", description: "Include standards and unknowns" },
        { id: "step-2-4", title: "Add BCA reagent", description: "200 μL per well" },
        { id: "step-2-5", title: "Incubate at 37°C", description: "30 minutes" },
        { id: "step-2-6", title: "Read absorbance at 562 nm", description: "Calculate concentrations from standard curve" },
      ],
    },
    {
      id: "step-3", step: 3, name: "Sodium Dodecyl Sulfate Polyacrylamide Gel Electrophoresis (SDS-PAGE)", category: "method",
      objective: "Separate proteins by molecular weight using SDS-PAGE",
      method: "Denaturing gel electrophoresis", ready: true,
      protocolId: "protocol-3", parametersState: "configured" as const,
      dateSelected: "2025-02-02", author: owner?.name || "Unknown",
      executionStatus: completedModules.has("step-3") ? "completed" : "idle",
      isSubStep: false,
      executionSteps: [
        { id: "step-3-1", title: "Prepare protein samples", description: "Add loading buffer and heat denature" },
        { id: "step-3-2", title: "Load samples onto gel", description: "Include molecular weight marker" },
        { id: "step-3-3", title: "Run electrophoresis", description: "80-120V until dye front reaches bottom" },
        { id: "step-3-4", title: "Monitor separation", description: "Check protein migration" },
      ],
    },
    {
      id: "step-3-sub", step: 3.1, name: "SDS-PAGE Gel Preparation", category: "method",
      objective: "Prepare polyacrylamide gel for SDS-PAGE electrophoresis",
      method: "Acrylamide gel casting", ready: true,
      protocolId: "protocol-3-sub", parametersState: "configured" as const,
      dateSelected: "2025-02-02", author: owner?.name || "Unknown",
      executionStatus: completedModules.has("step-3-sub") ? "completed" : "idle",
      isSubStep: true,
      parentStepId: "step-3",
      executionSteps: [
        { id: "step-3-sub-1", title: "Assemble gel casting apparatus", description: "Clean glass plates and spacers" },
        { id: "step-3-sub-2", title: "Prepare resolving gel solution", description: "Mix acrylamide, buffer, SDS, APS, TEMED" },
        { id: "step-3-sub-3", title: "Pour resolving gel", description: "Add isopropanol overlay" },
        { id: "step-3-sub-4", title: "Allow gel to polymerize", description: "30-45 minutes" },
        { id: "step-3-sub-5", title: "Prepare and pour stacking gel", description: "Lower percentage acrylamide" },
        { id: "step-3-sub-6", title: "Insert comb", description: "Form wells for sample loading" },
      ],
    },
    {
      id: "step-4", step: 4, name: "Western Blotting", category: "method",
      objective: "Transfer proteins to membrane and detect target proteins using antibodies",
      method: "Immunoblot detection protocol", ready: true,
      protocolId: "protocol-4", parametersState: "configured" as const,
      dateSelected: "2025-02-03", author: owner?.name || "Unknown",
      executionStatus: completedModules.has("step-4") ? "completed" : "idle",
      isSubStep: false,
      executionSteps: [
        { id: "step-4-1", title: "Transfer proteins to membrane", description: "Wet or semi-dry transfer" },
        { id: "step-4-2", title: "Block membrane", description: "5% milk or BSA in TBST" },
        { id: "step-4-3", title: "Incubate with primary antibody", description: "Overnight at 4°C" },
        { id: "step-4-4", title: "Wash membrane", description: "3x with TBST" },
        { id: "step-4-5", title: "Incubate with secondary antibody", description: "HRP-conjugated, 1 hour at RT" },
        { id: "step-4-6", title: "Wash and detect", description: "ECL substrate and imaging" },
      ],
    },
  ]

  const isPipelineCompleted = pipelineSteps.every(step => completedModules.has(step.id))

  const handleRunPipeline = () => {
    const firstStep = pipelineSteps[0]
    if (firstStep && !completedModules.has(firstStep.id)) handleRunStep(firstStep.id)
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "steps", label: `Steps (${pipelineSteps.filter(s => !s.isSubStep).length})` },
    { id: "attachments", label: `Attachments (${pipeline.attachments || 0})` },
    { id: "activity", label: "Activity" },
  ]

  // ── View mode ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex min-h-0">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="mx-auto max-w-[1200px] px-6 py-8">

            {/* ── Breadcrumb ──────────────────────────────────────────── */}
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
              <Link href="/projects" className="hover:text-gray-900 transition-colors">
                Projects
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
              <Link href={`/projects/${project.id}`} className="hover:text-gray-900 transition-colors">
                {project.name}
              </Link>
            </div>

            {/* ── Page header ─────────────────────────────────────────── */}
            <div className="flex items-start justify-between pb-6 border-b border-gray-200">
              <div>
                {editingTitle ? (
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      className="text-[32px] font-semibold border-b border-gray-300 focus:border-blue-500 outline-none bg-transparent w-full"
                      value={titleValue}
                      onChange={e => setTitleValue(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") handleTitleSave(); if (e.key === "Escape") setEditingTitle(false) }}
                      autoFocus
                    />
                    <Button size="sm" onClick={handleTitleSave}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingTitle(false)}>Cancel</Button>
                  </div>
                ) : (
                  <div className="group flex items-center gap-2 cursor-pointer mb-1" onClick={canEditPipeline ? handleTitleEditOpen : undefined}>
                    <h1 className="text-[32px] font-semibold">{pipeline.name}</h1>
                    {canEditPipeline && <Pencil className="h-4 w-4 text-gray-300 mt-1" />}
                  </div>
                )}
                {editingDescription ? (
                  <div className="mt-2 flex flex-col gap-2 max-w-xl">
                    <Textarea
                      value={descGoal}
                      onChange={e => setDescGoal(e.target.value)}
                      placeholder="Goal"
                      rows={2}
                      className="text-sm resize-none"
                      autoFocus
                    />
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={handleDescriptionSave}>Save</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingDescription(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="group flex items-start gap-1.5 cursor-pointer mt-1" onClick={canEditPipeline ? handleDescriptionEditOpen : undefined}>
                    <p className="text-gray-500 group-hover:text-gray-700">
                      {pipeline.description.goal || (canEditPipeline && <span className="text-gray-300 italic">Add a goal…</span>)}
                    </p>
                    {canEditPipeline && <Pencil className="h-3.5 w-3.5 text-gray-300 mt-1 shrink-0" />}
                  </div>
                )}
                <p className="text-sm text-gray-400 mt-2">
                  {owner?.name ?? "Unknown"}
                  {" · "}
                  {formatDate(pipeline.lastModified)}
                  {lastModifiedBy && ` · Modified by ${lastModifiedBy.name}`}
                  {pipeline.shareCount > 0 && ` · Shared with ${pipeline.shareCount}`}
                  {folder && (
                    <>
                      {" · "}
                      <Link href={`/pipelines/${folder.id}`} className="inline-flex items-center gap-1 hover:text-gray-700 transition-colors">
                        <Folder className="h-3 w-3" />
                        {folder.name}
                      </Link>
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2 mt-1 shrink-0">
                {canEditPipeline && (
                  <>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
                      <Copy className="mr-1.5 h-4 w-4" />
                      Duplicate
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
                      <Share2 className="mr-1.5 h-4 w-4" />
                      Share
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900" onClick={() => router.push(`/projects/${projectId}/pipeline/${pipelineId}/edit`)}>
                      <Edit className="mr-1.5 h-4 w-4" />
                      Edit
                    </Button>
                  </>
                )}
                <div suppressHydrationWarning>
                  {isPipelineCompleted ? (
                    <Button size="sm" onClick={() => router.push(`/projects/${projectId}/pipeline/${pipelineId}/report`)}>
                      <FileText className="mr-1.5 h-4 w-4" />
                      Report
                    </Button>
                  ) : (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={handleRunPipeline}>
                      <Play className="mr-1.5 h-4 w-4" />
                      Run
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* ── Tabs ────────────────────────────────────────────────── */}
            <div className="border-b border-gray-200 mb-8">
              <div className="flex">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-base transition-colors ${
                      activeTab === tab.id
                        ? "border-b-2 border-black font-bold text-gray-900"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Steps tab ───────────────────────────────────────────── */}
            {activeTab === "steps" && (
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-0" suppressHydrationWarning>
                  <span className="text-sm text-gray-500">
                    {completedModules.size} of {pipelineSteps.filter(s => !s.isSubStep).length} completed
                  </span>
                </div>
                <PipelineListView
                  steps={pipelineSteps}
                  showStepConnector
                  hideColumns={['status', 'action', 'dateSelected', 'author']}
                  showCreatedColumn
                  onParametersClick={step => openModalForStep("parameters", step.name)}
                  onBuffersClick={step => openModalForStep("buffers", step.name)}
                  onMaterialsClick={step => openModalForStep("materials", step.name)}
                  onPlanClick={step => openPlanForStep(step.name)}
                  onInputClick={step => {
                    const stepIndex = pipelineSteps.findIndex(s => s.id === step.id)
                    if (stepIndex > 0) {
                      // Copy previous step's output directly as input
                      const prevStepId = pipelineSteps[stepIndex - 1].id
                      const prevOutput = moduleDataMap[prevStepId]?.outputData ?? { text: "", files: [] }
                      setModuleDataMap(prev => ({
                        ...prev,
                        [step.id]: {
                          ...prev[step.id],
                          inputData: prevOutput,
                          outputData: prev[step.id]?.outputData ?? { text: "", files: [] },
                          checkedSteps: prev[step.id]?.checkedSteps ?? [],
                          startedAt: prev[step.id]?.startedAt ?? nowLabel(),
                          inputUser: prev[step.id]?.inputUser ?? currentUser.name,
                        },
                      }))
                    } else {
                      setCurrentExecutingModule(step.id)
                      setWorkflowStep("input")
                    }
                  }}
                  onOutputClick={step => {
                    setCurrentExecutingModule(step.id)
                    setWorkflowStep("output")
                  }}
                  completedModules={completedModules}
                  moduleDataMap={moduleDataMap}
                />
              </div>
            )}

            {/* ── Attachments tab ─────────────────────────────────────── */}
            {activeTab === "attachments" && (
              <div className="py-24 text-center">
                <Paperclip className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-1">No attachments</p>
                <p className="text-gray-500 mb-6">
                  Add files, protocols, or documentation to this pipeline
                </p>
                {canEditPipeline && (
                  <Button>
                    <Paperclip className="mr-2 h-4 w-4" />
                    Add attachment
                  </Button>
                )}
              </div>
            )}

            {/* ── Activity tab ─────────────────────────────────────────── */}
            {activeTab === "activity" && (
              <div>
                {(() => {
                  const projectActivities = getProjectActivities(projectId).filter(
                    a => !a.pipelineId || a.pipelineId === pipelineId
                  )

                  const actionLabel = (action: string, detail?: string): { icon: React.ReactNode; text: string } => {
                    switch (action) {
                      case 'created_project':
                        return { icon: <User className="h-4 w-4 text-gray-500" />, text: `created the project "${detail}"` }
                      case 'created_pipeline':
                        return { icon: <User className="h-4 w-4 text-blue-500" />, text: `created the pipeline "${detail}"` }
                      case 'edited_pipeline':
                        return { icon: <Edit className="h-4 w-4 text-gray-500" />, text: `edited the pipeline "${detail}"` }
                      case 'ran_pipeline':
                        return { icon: <Play className="h-4 w-4 text-green-500" />, text: `ran the pipeline "${detail}"` }
                      case 'completed_pipeline':
                        return { icon: <Play className="h-4 w-4 text-green-600" />, text: `completed the pipeline "${detail}"` }
                      case 'added_participant':
                        return { icon: <UserPlus className="h-4 w-4 text-blue-500" />, text: `added ${detail} to the project` }
                      case 'removed_participant':
                        return { icon: <UserMinus className="h-4 w-4 text-gray-400" />, text: `removed ${detail} from the project` }
                      case 'uploaded_file':
                        return { icon: <FileText className="h-4 w-4 text-purple-500" />, text: `uploaded "${detail}"` }
                      default:
                        return { icon: <User className="h-4 w-4 text-gray-500" />, text: detail ?? action }
                    }
                  }

                  if (projectActivities.length === 0) {
                    return (
                      <div className="py-24 text-center">
                        <User className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No activity yet</p>
                      </div>
                    )
                  }

                  return projectActivities.map(entry => {
                    const actorUser = getUserById(entry.userId)
                    const { icon, text } = actionLabel(entry.action, entry.detail)
                    return (
                      <div key={entry.id} className="flex items-start gap-4 py-4 border-b border-gray-100">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                          {icon}
                        </div>
                        <div>
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{actorUser?.name ?? "Unknown"}</span>
                            {" "}
                            {text}
                          </p>
                          <p className="text-sm text-gray-400 mt-0.5">{formatDate(entry.date)}</p>
                        </div>
                      </div>
                    )
                  })
                })()}
              </div>
            )}

          </div>
        </main>
      </div>
      <Footer />

      {isMounted && currentExecutingModule && (
        <>
          <ModuleInputDialog
            open={workflowStep === "input"}
            onOpenChange={open => { if (!open) { setCurrentExecutingModule(null); setWorkflowStep(null) } }}
            moduleName={pipelineSteps.find(s => s.id === currentExecutingModule)?.name || ""}
            onContinue={handleInputContinue}
            initialData={moduleDataMap[currentExecutingModule]?.inputData}
          />
          <ModuleExecutionDialog
            open={workflowStep === "execution"}
            onOpenChange={open => { if (!open) { setCurrentExecutingModule(null); setWorkflowStep(null) } }}
            moduleName={pipelineSteps.find(s => s.id === currentExecutingModule)?.name || ""}
            steps={pipelineSteps.find(s => s.id === currentExecutingModule)?.executionSteps || []}
            onComplete={handleExecutionComplete}
          />
          <ModuleOutputDialog
            open={workflowStep === "output"}
            onOpenChange={open => { if (!open) { setCurrentExecutingModule(null); setWorkflowStep(null) } }}
            moduleName={pipelineSteps.find(s => s.id === currentExecutingModule)?.name || ""}
            isLastModule={pipelineSteps.findIndex(s => s.id === currentExecutingModule) === pipelineSteps.length - 1}
            onComplete={handleOutputComplete}
            initialData={moduleDataMap[currentExecutingModule]?.outputData}
          />
        </>
      )}

      {stepModal.type === "parameters" && stepModal.stepName && (
        <ParametersModal isOpen onClose={closeStepModal} stepName={stepModal.stepName} isEditable onApply={closeStepModal} />
      )}
      {stepModal.type === "buffers" && stepModal.stepName && (
        <BufferRecipesModal
          isOpen onClose={closeStepModal} stepName={stepModal.stepName}
          buffers={[
            { name: "RIPA Buffer", components: [
              { component: "Tris-HCl (pH 7.4)", concentration: "50 mM", volume: "5 ml" },
              { component: "NaCl", concentration: "150 mM", volume: "8.77 g/L" },
              { component: "NP-40", concentration: "1%", volume: "10 ml" },
            ]},
            { name: "PBS", components: [
              { component: "NaCl", concentration: "137 mM", volume: "8 g/L" },
              { component: "KCl", concentration: "2.7 mM", volume: "0.2 g/L" },
            ]},
          ]}
        />
      )}
      {stepModal.type === "materials" && stepModal.stepName && (
        <MaterialsModal
          isOpen onClose={closeStepModal} stepName={stepModal.stepName}
          materials={{
            reagents: ["RIPA buffer or NP-40 buffer", "Protease/phosphatase inhibitor cocktail", "PBS"],
            consumables: ["15 ml centrifuge tubes", "1.5 ml microcentrifuge tubes", "Pipette tips"],
            equipment: ["Refrigerated centrifuge", "Ice bucket", "Pipettes", "Vortex mixer"],
          }}
        />
      )}
      <WesternBlotPlanOverlay isOpen={stepModal.type === "plan-western-blot"} onClose={closeStepModal} onApply={closeStepModal} />
      <CustomModulePlanOverlay isOpen={stepModal.type === "plan-custom-module"} onClose={closeStepModal} onApply={closeStepModal} />
    </div>
  )
}
