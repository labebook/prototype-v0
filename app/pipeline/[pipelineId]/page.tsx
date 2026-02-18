"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Copy,
  Edit,
  FileText,
  Folder,
  Paperclip,
  Play,
  Save,
  Share2,
  User,
  X,
} from "lucide-react"
import { NewPipelineEditor } from "@/components/new-pipeline-editor"
import { PipelineListView } from "@/components/pipeline-list-view"
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
}

export default function PipelineDetailPage() {
  const params = useParams()
  const router = useRouter()
  const pipelineId = params.pipelineId as string
  const [isEditMode, setIsEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>("steps")

  const { currentTeam, pipelines, pipelineFolders, canEdit } = useTeam()

  const [currentExecutingModule, setCurrentExecutingModule] = useState<string | null>(null)
  const [workflowStep, setWorkflowStep] = useState<"input" | "execution" | "output" | null>(null)
  const [moduleDataMap, setModuleDataMap] = useState<Record<string, ModuleData>>({})
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set())
  const [isMounted, setIsMounted] = useState(false)

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

  const pipeline = pipelines.find(p => p.id === pipelineId)

  if (!pipeline) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Pipeline Not Found</h2>
              <p className="text-gray-600 mb-6">The pipeline you're looking for doesn't exist</p>
              <Button onClick={() => router.push("/pipelines")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Pipelines
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

  const handleRunStep = (stepId: string) => {
    setCurrentExecutingModule(stepId)
    setWorkflowStep("input")
  }

  const handleInputContinue = (data: { text: string; files: File[] }) => {
    if (currentExecutingModule) {
      setModuleDataMap(prev => ({
        ...prev,
        [currentExecutingModule]: {
          ...prev[currentExecutingModule],
          inputData: data,
          outputData: { text: "", files: [] },
          checkedSteps: [],
        },
      }))
      setWorkflowStep("execution")
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
        [currentExecutingModule]: { ...prev[currentExecutingModule], outputData: data },
      }))
      setCompletedModules(prev => new Set([...prev, currentExecutingModule]))

      const currentStepIndex = pipelineSteps.findIndex(s => s.id === currentExecutingModule)
      const isLastModule = currentStepIndex === pipelineSteps.length - 1

      if (!isLastModule) {
        const nextStepId = pipelineSteps[currentStepIndex + 1]?.id
        if (nextStepId) {
          setCurrentExecutingModule(nextStepId)
          setModuleDataMap(prev => ({
            ...prev,
            [nextStepId]: { inputData: data, outputData: { text: "", files: [] }, checkedSteps: [] },
          }))
          setWorkflowStep("input")
          return
        }
      }

      setCurrentExecutingModule(null)
      setWorkflowStep(null)
    }
  }

  const pipelineSteps = [
    {
      id: "step-1", step: 1, name: "Sample Preparation", category: "method",
      objective: "Prepare biological samples for RNA extraction",
      method: "Standard sample preparation protocol", ready: true,
      protocolId: "protocol-1", parametersState: "configured" as const,
      dateSelected: "2025-02-01", author: owner?.name || "Unknown",
      executionStatus: completedModules.has("step-1") ? "completed" : "idle",
      executionSteps: [
        { id: "step-1-1", title: "Gather required samples", description: "Collect tissue samples from biological source" },
        { id: "step-1-2", title: "Label samples properly", description: "Use appropriate labeling system" },
        { id: "step-1-3", title: "Prepare storage containers", description: "Ensure sterile conditions" },
        { id: "step-1-4", title: "Store at appropriate temperature", description: "Follow protocol requirements" },
      ],
    },
    {
      id: "step-2", step: 2, name: "RNA Isolation", category: "method",
      objective: "Extract total RNA from prepared samples",
      method: "TRIzol extraction method", ready: true,
      protocolId: "protocol-2", parametersState: "configured" as const,
      dateSelected: "2025-02-01", author: owner?.name || "Unknown",
      executionStatus: completedModules.has("step-2") ? "completed" : "idle",
      executionSteps: [
        { id: "step-2-1", title: "Add TRIzol reagent to samples", description: "1ml TRIzol per 100mg tissue" },
        { id: "step-2-2", title: "Homogenize samples", description: "Use mechanical homogenizer" },
        { id: "step-2-3", title: "Add chloroform and mix", description: "0.2ml per 1ml TRIzol" },
        { id: "step-2-4", title: "Centrifuge at 12,000g for 15 min", description: "At 4°C" },
        { id: "step-2-5", title: "Transfer aqueous phase", description: "Carefully avoid interface" },
        { id: "step-2-6", title: "Precipitate RNA with isopropanol", description: "Mix and incubate" },
      ],
    },
    {
      id: "step-3", step: 3, name: "Quality Control", category: "module",
      objective: "Assess RNA quality and quantity",
      method: "Spectrophotometry and gel electrophoresis", ready: true,
      protocolId: "protocol-3", parametersState: "configured" as const,
      dateSelected: "2025-02-02", author: owner?.name || "Unknown",
      executionStatus: completedModules.has("step-3") ? "completed" : "idle",
      executionSteps: [
        { id: "step-3-1", title: "Measure RNA concentration", description: "Use NanoDrop spectrophotometer" },
        { id: "step-3-2", title: "Check A260/A280 ratio", description: "Should be ~2.0 for pure RNA" },
        { id: "step-3-3", title: "Check A260/A230 ratio", description: "Should be 2.0-2.2" },
        { id: "step-3-4", title: "Run gel electrophoresis", description: "1% agarose gel to check integrity" },
        { id: "step-3-5", title: "Visualize RNA bands", description: "Look for 28S and 18S ribosomal bands" },
      ],
    },
    {
      id: "step-4", step: 4, name: "cDNA Synthesis", category: "method",
      objective: "Synthesize complementary DNA from RNA template",
      method: "Reverse transcription with random primers", ready: true,
      protocolId: "protocol-4", parametersState: "configured" as const,
      dateSelected: "2025-02-03", author: owner?.name || "Unknown",
      executionStatus: completedModules.has("step-4") ? "completed" : "idle",
      executionSteps: [
        { id: "step-4-1", title: "Prepare reaction mix", description: "RT buffer, dNTPs, random primers" },
        { id: "step-4-2", title: "Add RNA template", description: "1-5 μg total RNA" },
        { id: "step-4-3", title: "Add reverse transcriptase enzyme", description: "MMLV or similar" },
        { id: "step-4-4", title: "Incubate at 37°C for 60 min", description: "Allow RT reaction" },
        { id: "step-4-5", title: "Inactivate enzyme at 70°C for 10 min", description: "Stop reaction" },
      ],
    },
    {
      id: "step-5", step: 5, name: "qPCR Analysis", category: "method",
      objective: "Quantify gene expression levels",
      method: "Real-time PCR with SYBR Green", ready: true,
      protocolId: "protocol-5", parametersState: "configured" as const,
      dateSelected: "2025-02-04", author: owner?.name || "Unknown",
      executionStatus: completedModules.has("step-5") ? "completed" : "idle",
      executionSteps: [
        { id: "step-5-1", title: "Prepare qPCR reaction mix", description: "SYBR Green master mix + primers" },
        { id: "step-5-2", title: "Add cDNA template", description: "Dilute appropriately" },
        { id: "step-5-3", title: "Load samples into plate", description: "Include controls and triplicates" },
        { id: "step-5-4", title: "Run qPCR program", description: "Follow manufacturer protocol" },
        { id: "step-5-5", title: "Analyze amplification curves", description: "Check Ct values" },
        { id: "step-5-6", title: "Verify melt curves", description: "Ensure single product" },
      ],
    },
    {
      id: "step-6", step: 6, name: "Data Analysis", category: "module",
      objective: "Analyze and interpret qPCR results",
      method: "Statistical analysis using ΔΔCt method", ready: true,
      protocolId: "protocol-6", parametersState: "configured" as const,
      dateSelected: "2025-02-05", author: owner?.name || "Unknown",
      executionStatus: completedModules.has("step-6") ? "completed" : "idle",
      executionSteps: [
        { id: "step-6-1", title: "Export Ct values", description: "From qPCR machine software" },
        { id: "step-6-2", title: "Calculate ΔCt values", description: "Normalize to housekeeping gene" },
        { id: "step-6-3", title: "Calculate ΔΔCt values", description: "Compare to control samples" },
        { id: "step-6-4", title: "Calculate fold changes", description: "Use 2^-ΔΔCt formula" },
        { id: "step-6-5", title: "Perform statistical tests", description: "T-test or ANOVA as appropriate" },
        { id: "step-6-6", title: "Create visualizations", description: "Generate graphs and charts" },
      ],
    },
  ]

  const isPipelineCompleted = pipelineSteps.every(step => completedModules.has(step.id))

  const handleRunPipeline = () => {
    const firstStep = pipelineSteps[0]
    if (firstStep && !completedModules.has(firstStep.id)) handleRunStep(firstStep.id)
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "steps", label: `Steps (${pipelineSteps.length})` },
    { id: "attachments", label: `Attachments (${pipeline.attachments || 0})` },
    { id: "activity", label: "Activity" },
  ]

  // ── Edit mode ─────────────────────────────────────────────────────────────
  if (isEditMode) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col">
          <div className="border-b border-gray-200 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">Editing: {pipeline.name}</h2>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                Edit Mode
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setIsEditMode(false)}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={() => setIsEditMode(false)} className="bg-green-600 hover:bg-green-700">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <NewPipelineEditor />
          </div>
        </div>
      </div>
    )
  }

  // ── View mode ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1200px] px-6 py-8">

            {/* ── Breadcrumb ──────────────────────────────────────────── */}
            <Link
              href="/pipelines"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Pipelines
            </Link>

            {/* ── Page header ─────────────────────────────────────────── */}
            <div className="flex items-start justify-between pb-6 border-b border-gray-200">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-[32px] font-semibold">{pipeline.name}</h1>
                  {pipeline.isReady ? (
                    <Badge className="bg-green-100 text-green-700 border-0">Ready</Badge>
                  ) : (
                    <Badge variant="outline">In progress</Badge>
                  )}
                </div>
                <p className="text-gray-500 mt-1">{pipeline.description.goal}</p>
                {pipeline.description.context && (
                  <p className="text-gray-400 text-sm mt-1">{pipeline.description.context}</p>
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
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900" onClick={() => setIsEditMode(true)}>
                      <Edit className="mr-1.5 h-4 w-4" />
                      Edit
                    </Button>
                  </>
                )}
                <div suppressHydrationWarning>
                  {isPipelineCompleted ? (
                    <Button size="sm" onClick={() => router.push(`/pipeline/${pipelineId}/report`)}>
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
                    {completedModules.size} of {pipelineSteps.length} completed
                  </span>
                </div>
                <PipelineListView
                  steps={pipelineSteps}
                  onParametersClick={step => console.log("Parameters:", step)}
                  onProtocolClick={step => console.log("Protocol:", step)}
                  onBuffersClick={step => console.log("Buffers:", step)}
                  onCalculationsClick={step => console.log("Calculations:", step)}
                  onMaterialsClick={step => console.log("Materials:", step)}
                  onPlanClick={step => console.log("Plan:", step)}
                  onRunStep={handleRunStep}
                  completedModules={completedModules}
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
                <div className="flex items-start gap-4 py-5 border-b border-gray-200">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{owner?.name}</span> created this pipeline
                    </p>
                    <p className="text-sm text-gray-400 mt-0.5">{formatDate(pipeline.lastModified)}</p>
                  </div>
                </div>
                {lastModifiedBy && (
                  <div className="flex items-start gap-4 py-5 border-b border-gray-200">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <Edit className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{lastModifiedBy.name}</span> updated this pipeline
                      </p>
                      <p className="text-sm text-gray-400 mt-0.5">{formatDate(pipeline.lastModified)}</p>
                    </div>
                  </div>
                )}
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
    </div>
  )
}
