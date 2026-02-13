"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Calendar,
  User,
  Edit,
  Trash2,
  Share2,
  Folder,
  Paperclip,
  Play,
  Copy,
  X,
  Save,
  FileText,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PermissionBadge } from "@/components/ui/permission-badge"
import { NewPipelineEditor } from "@/components/new-pipeline-editor"
import { PipelineListView } from "@/components/pipeline-list-view"
import { ModuleInputDialog } from "@/components/module-input-dialog"
import { ModuleExecutionDialog } from "@/components/module-execution-dialog"
import { ModuleOutputDialog } from "@/components/module-output-dialog"
import { useTeam } from "@/hooks/useTeam"
import { getUserById } from "@/lib/mockData"
import Link from "next/link"

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

  const {
    currentTeam,
    currentUser,
    pipelines,
    pipelineFolders,
    canEdit,
  } = useTeam()

  // Workflow state
  const [currentExecutingModule, setCurrentExecutingModule] = useState<string | null>(null)
  const [workflowStep, setWorkflowStep] = useState<'input' | 'execution' | 'output' | null>(null)
  const [moduleDataMap, setModuleDataMap] = useState<Record<string, ModuleData>>({})
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set())
  const [isMounted, setIsMounted] = useState(false)

  // Ensure client-side hydration is complete
  useEffect(() => {
    setIsMounted(true)
  }, [])

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

  // Find the pipeline
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
              <Button onClick={() => router.push('/pipelines')}>
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

  const folder = pipeline.folderId
    ? pipelineFolders.find(f => f.id === pipeline.folderId)
    : null
  const owner = getUserById(pipeline.ownerId)
  const lastModifiedBy = pipeline.lastModifiedBy
    ? getUserById(pipeline.lastModifiedBy)
    : null
  const canEditPipeline = canEdit('pipeline', pipeline.id)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Start module execution workflow
  const handleRunStep = (stepId: string) => {
    setCurrentExecutingModule(stepId)
    setWorkflowStep('input')
  }

  // Handle input data submission
  const handleInputContinue = (data: { text: string; files: File[] }) => {
    if (currentExecutingModule) {
      setModuleDataMap(prev => ({
        ...prev,
        [currentExecutingModule]: {
          ...prev[currentExecutingModule],
          inputData: data,
          outputData: { text: '', files: [] },
          checkedSteps: []
        }
      }))
      setWorkflowStep('execution')
    }
  }

  // Handle execution steps completion
  const handleExecutionComplete = (checkedSteps: string[]) => {
    if (currentExecutingModule) {
      setModuleDataMap(prev => ({
        ...prev,
        [currentExecutingModule]: {
          ...prev[currentExecutingModule],
          checkedSteps
        }
      }))
      setWorkflowStep('output')
    }
  }

  // Handle output data submission and module completion
  const handleOutputComplete = (data: { text: string; files: File[] }) => {
    if (currentExecutingModule) {
      setModuleDataMap(prev => ({
        ...prev,
        [currentExecutingModule]: {
          ...prev[currentExecutingModule],
          outputData: data
        }
      }))

      // Mark module as completed
      setCompletedModules(prev => new Set([...prev, currentExecutingModule]))

      // Check if this was the last module
      const currentStepIndex = pipelineSteps.findIndex(s => s.id === currentExecutingModule)
      const isLastModule = currentStepIndex === pipelineSteps.length - 1

      // Auto-start next module if not last
      if (!isLastModule) {
        const nextStepId = pipelineSteps[currentStepIndex + 1]?.id
        if (nextStepId) {
          // Use output as input for next module
          setCurrentExecutingModule(nextStepId)
          setModuleDataMap(prev => ({
            ...prev,
            [nextStepId]: {
              inputData: data, // Previous module's output becomes next module's input
              outputData: { text: '', files: [] },
              checkedSteps: []
            }
          }))
          setWorkflowStep('input')
          return
        }
      }

      // Reset workflow
      setCurrentExecutingModule(null)
      setWorkflowStep(null)
    }
  }

  // Sample pipeline steps with execution details (in real app, this would come from pipeline data)
  const pipelineSteps = [
    {
      id: 'step-1',
      step: 1,
      name: 'Sample Preparation',
      category: 'method',
      objective: 'Prepare biological samples for RNA extraction',
      method: 'Standard sample preparation protocol',
      ready: true,
      protocolId: 'protocol-1',
      parametersState: 'configured' as const,
      dateSelected: '2025-02-01',
      author: owner?.name || 'Unknown',
      executionStatus: completedModules.has('step-1') ? 'completed' : 'idle',
      executionSteps: [
        { id: 'step-1-1', title: 'Gather required samples', description: 'Collect tissue samples from biological source' },
        { id: 'step-1-2', title: 'Label samples properly', description: 'Use appropriate labeling system' },
        { id: 'step-1-3', title: 'Prepare storage containers', description: 'Ensure sterile conditions' },
        { id: 'step-1-4', title: 'Store at appropriate temperature', description: 'Follow protocol requirements' },
      ]
    },
    {
      id: 'step-2',
      step: 2,
      name: 'RNA Isolation',
      category: 'method',
      objective: 'Extract total RNA from prepared samples',
      method: 'TRIzol extraction method',
      ready: true,
      protocolId: 'protocol-2',
      parametersState: 'configured' as const,
      dateSelected: '2025-02-01',
      author: owner?.name || 'Unknown',
      executionStatus: completedModules.has('step-2') ? 'completed' : 'idle',
      executionSteps: [
        { id: 'step-2-1', title: 'Add TRIzol reagent to samples', description: '1ml TRIzol per 100mg tissue' },
        { id: 'step-2-2', title: 'Homogenize samples', description: 'Use mechanical homogenizer' },
        { id: 'step-2-3', title: 'Add chloroform and mix', description: '0.2ml per 1ml TRIzol' },
        { id: 'step-2-4', title: 'Centrifuge at 12,000g for 15 min', description: 'At 4°C' },
        { id: 'step-2-5', title: 'Transfer aqueous phase', description: 'Carefully avoid interface' },
        { id: 'step-2-6', title: 'Precipitate RNA with isopropanol', description: 'Mix and incubate' },
      ]
    },
    {
      id: 'step-3',
      step: 3,
      name: 'Quality Control',
      category: 'module',
      objective: 'Assess RNA quality and quantity',
      method: 'Spectrophotometry and gel electrophoresis',
      ready: true,
      protocolId: 'protocol-3',
      parametersState: 'configured' as const,
      dateSelected: '2025-02-02',
      author: owner?.name || 'Unknown',
      executionStatus: completedModules.has('step-3') ? 'completed' : 'idle',
      executionSteps: [
        { id: 'step-3-1', title: 'Measure RNA concentration', description: 'Use NanoDrop spectrophotometer' },
        { id: 'step-3-2', title: 'Check A260/A280 ratio', description: 'Should be ~2.0 for pure RNA' },
        { id: 'step-3-3', title: 'Check A260/A230 ratio', description: 'Should be 2.0-2.2' },
        { id: 'step-3-4', title: 'Run gel electrophoresis', description: '1% agarose gel to check integrity' },
        { id: 'step-3-5', title: 'Visualize RNA bands', description: 'Look for 28S and 18S ribosomal bands' },
      ]
    },
    {
      id: 'step-4',
      step: 4,
      name: 'cDNA Synthesis',
      category: 'method',
      objective: 'Synthesize complementary DNA from RNA template',
      method: 'Reverse transcription with random primers',
      ready: true,
      protocolId: 'protocol-4',
      parametersState: 'configured' as const,
      dateSelected: '2025-02-03',
      author: owner?.name || 'Unknown',
      executionStatus: completedModules.has('step-4') ? 'completed' : 'idle',
      executionSteps: [
        { id: 'step-4-1', title: 'Prepare reaction mix', description: 'RT buffer, dNTPs, random primers' },
        { id: 'step-4-2', title: 'Add RNA template', description: '1-5 μg total RNA' },
        { id: 'step-4-3', title: 'Add reverse transcriptase enzyme', description: 'MMLV or similar' },
        { id: 'step-4-4', title: 'Incubate at 37°C for 60 min', description: 'Allow RT reaction' },
        { id: 'step-4-5', title: 'Inactivate enzyme at 70°C for 10 min', description: 'Stop reaction' },
      ]
    },
    {
      id: 'step-5',
      step: 5,
      name: 'qPCR Analysis',
      category: 'method',
      objective: 'Quantify gene expression levels',
      method: 'Real-time PCR with SYBR Green',
      ready: true,
      protocolId: 'protocol-5',
      parametersState: 'configured' as const,
      dateSelected: '2025-02-04',
      author: owner?.name || 'Unknown',
      executionStatus: completedModules.has('step-5') ? 'completed' : 'idle',
      executionSteps: [
        { id: 'step-5-1', title: 'Prepare qPCR reaction mix', description: 'SYBR Green master mix + primers' },
        { id: 'step-5-2', title: 'Add cDNA template', description: 'Dilute appropriately' },
        { id: 'step-5-3', title: 'Load samples into plate', description: 'Include controls and triplicates' },
        { id: 'step-5-4', title: 'Run qPCR program', description: 'Follow manufacturer protocol' },
        { id: 'step-5-5', title: 'Analyze amplification curves', description: 'Check Ct values' },
        { id: 'step-5-6', title: 'Verify melt curves', description: 'Ensure single product' },
      ]
    },
    {
      id: 'step-6',
      step: 6,
      name: 'Data Analysis',
      category: 'module',
      objective: 'Analyze and interpret qPCR results',
      method: 'Statistical analysis using ΔΔCt method',
      ready: true,
      protocolId: 'protocol-6',
      parametersState: 'configured' as const,
      dateSelected: '2025-02-05',
      author: owner?.name || 'Unknown',
      executionStatus: completedModules.has('step-6') ? 'completed' : 'idle',
      executionSteps: [
        { id: 'step-6-1', title: 'Export Ct values', description: 'From qPCR machine software' },
        { id: 'step-6-2', title: 'Calculate ΔCt values', description: 'Normalize to housekeeping gene' },
        { id: 'step-6-3', title: 'Calculate ΔΔCt values', description: 'Compare to control samples' },
        { id: 'step-6-4', title: 'Calculate fold changes', description: 'Use 2^-ΔΔCt formula' },
        { id: 'step-6-5', title: 'Perform statistical tests', description: 'T-test or ANOVA as appropriate' },
        { id: 'step-6-6', title: 'Create visualizations', description: 'Generate graphs and charts' },
      ]
    },
  ]

  // Check if pipeline is fully completed
  const isPipelineCompleted = pipelineSteps.every(step => completedModules.has(step.id))

  // Handle pipeline run (starts from first module)
  const handleRunPipeline = () => {
    const firstStep = pipelineSteps[0]
    if (firstStep && !completedModules.has(firstStep.id)) {
      handleRunStep(firstStep.id)
    }
  }

  const handleSave = () => {
    // In real app, this would save the pipeline changes
    console.log('Saving pipeline changes...')
    setIsEditMode(false)
  }

  const handleCancelEdit = () => {
    // In real app, might want to confirm if there are unsaved changes
    setIsEditMode(false)
  }

  // Show editor in edit mode
  if (isEditMode) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <div className="flex-1 flex flex-col">
          {/* Edit Mode Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">Editing: {pipeline.name}</h2>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                Edit Mode
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleCancelEdit}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>

          {/* Pipeline Editor */}
          <div className="flex-1 overflow-hidden">
            <NewPipelineEditor />
          </div>
        </div>
      </div>
    )
  }

  // View mode (existing detail view)
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto max-w-7xl p-8">
            {/* Back Button and Quick Edit */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/pipelines')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Pipelines
              </Button>
              {canEditPipeline && (
                <Button onClick={() => setIsEditMode(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Pipeline
                </Button>
              )}
            </div>

            {/* Pipeline Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{pipeline.name}</h1>
                    <PermissionBadge canEdit={canEditPipeline} showText={false} />
                    {pipeline.isReady ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        Ready
                      </Badge>
                    ) : (
                      <Badge variant="outline">In Progress</Badge>
                    )}
                  </div>

                  {/* Goal */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Goal</h3>
                    <p className="text-lg text-gray-700">{pipeline.description.goal}</p>
                  </div>

                  {/* Context */}
                  {pipeline.description.context && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Context</h3>
                      <p className="text-gray-600">{pipeline.description.context}</p>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Owner: <span className="font-medium">{owner?.name || 'Unknown'}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Modified: {formatDate(pipeline.lastModified)}</span>
                    </div>
                    {lastModifiedBy && (
                      <div className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        <span>By: {lastModifiedBy.name}</span>
                      </div>
                    )}
                    {pipeline.shareCount > 0 && (
                      <div className="flex items-center gap-2">
                        <Share2 className="h-4 w-4" />
                        <span>Shared with {pipeline.shareCount} {pipeline.shareCount === 1 ? 'person' : 'people'}</span>
                      </div>
                    )}
                  </div>

                  {/* Folder Info */}
                  {folder && (
                    <div className="mt-3">
                      <Link
                        href={`/pipelines/${folder.id}`}
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                      >
                        <Folder className="h-4 w-4" />
                        {folder.name}
                      </Link>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {canEditPipeline && (
                    <>
                      <Button variant="outline" size="sm">
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                      <Button size="sm" onClick={() => setIsEditMode(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Pipeline
                      </Button>
                    </>
                  )}
                  <div suppressHydrationWarning>
                    {isPipelineCompleted ? (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push(`/pipeline/${pipelineId}/report`)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Report
                      </Button>
                    ) : (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={handleRunPipeline}>
                        <Play className="mr-2 h-4 w-4" />
                        Run Pipeline
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Pipeline Content */}
            <Tabs defaultValue="steps" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="steps">
                  Steps ({pipelineSteps.length})
                </TabsTrigger>
                <TabsTrigger value="attachments">
                  Attachments ({pipeline.attachments || 0})
                </TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              {/* Steps Tab - Unified Pipeline List View */}
              <TabsContent value="steps" className="mt-0">
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Pipeline Steps</h3>
                      <div className="text-sm text-gray-600" suppressHydrationWarning>
                        {completedModules.size} of {pipelineSteps.length} modules completed
                      </div>
                    </div>
                  </div>
                  <PipelineListView
                    steps={pipelineSteps}
                    onParametersClick={(step) => console.log('Parameters clicked:', step)}
                    onProtocolClick={(step) => console.log('Protocol clicked:', step)}
                    onBuffersClick={(step) => console.log('Buffers clicked:', step)}
                    onCalculationsClick={(step) => console.log('Calculations clicked:', step)}
                    onMaterialsClick={(step) => console.log('Materials clicked:', step)}
                    onPlanClick={(step) => console.log('Plan clicked:', step)}
                    onRunStep={handleRunStep}
                    completedModules={completedModules}
                  />
                </div>
              </TabsContent>

              {/* Attachments Tab */}
              <TabsContent value="attachments">
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <Paperclip className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Attachments</h3>
                  <p className="text-gray-600 mb-4">
                    Add files, protocols, or documentation to this pipeline
                  </p>
                  {canEditPipeline && (
                    <Button>
                      <Paperclip className="mr-2 h-4 w-4" />
                      Add Attachment
                    </Button>
                  )}
                </div>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity">
                <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{owner?.name}</span> created this pipeline
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(pipeline.lastModified)}</p>
                      </div>
                    </div>
                  </div>
                  {lastModifiedBy && (
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Edit className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{lastModifiedBy.name}</span> updated this pipeline
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(pipeline.lastModified)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <Footer />

      {/* Execution Workflow Dialogs - Only render on client after mount */}
      {isMounted && currentExecutingModule && (
        <>
          <ModuleInputDialog
            open={workflowStep === 'input'}
            onOpenChange={(open) => {
              if (!open) {
                setCurrentExecutingModule(null)
                setWorkflowStep(null)
              }
            }}
            moduleName={pipelineSteps.find(s => s.id === currentExecutingModule)?.name || ''}
            onContinue={handleInputContinue}
            initialData={moduleDataMap[currentExecutingModule]?.inputData}
          />

          <ModuleExecutionDialog
            open={workflowStep === 'execution'}
            onOpenChange={(open) => {
              if (!open) {
                setCurrentExecutingModule(null)
                setWorkflowStep(null)
              }
            }}
            moduleName={pipelineSteps.find(s => s.id === currentExecutingModule)?.name || ''}
            steps={pipelineSteps.find(s => s.id === currentExecutingModule)?.executionSteps || []}
            onComplete={handleExecutionComplete}
          />

          <ModuleOutputDialog
            open={workflowStep === 'output'}
            onOpenChange={(open) => {
              if (!open) {
                setCurrentExecutingModule(null)
                setWorkflowStep(null)
              }
            }}
            moduleName={pipelineSteps.find(s => s.id === currentExecutingModule)?.name || ''}
            isLastModule={pipelineSteps.findIndex(s => s.id === currentExecutingModule) === pipelineSteps.length - 1}
            onComplete={handleOutputComplete}
            initialData={moduleDataMap[currentExecutingModule]?.outputData}
          />
        </>
      )}
    </div>
  )
}
