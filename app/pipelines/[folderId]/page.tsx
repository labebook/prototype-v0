"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, LayoutGrid, List, Share2 } from "lucide-react"
import { PipelineListView } from "@/components/pipeline-list-view"
import { StaticPipelineCanvas } from "@/components/static-pipeline-canvas"
import { cn } from "@/lib/utils"
import { useTeam } from "@/hooks/useTeam"
import { getUserById } from "@/lib/mockData"
import Link from "next/link"

// ── Mock step data keyed by pipeline ID ───────────────────────────────────────
const pipelineStepsMap: Record<string, any[]> = {
  p1: [
    {
      id: "p1-s1", step: 1, name: "Whole-cell protein lysate preparation",
      category: "module", objective: "Lyse cells and extract total protein from suspension cell culture.",
      method: "Custom Module", ready: false, protocolId: "CM-001",
      parametersState: "none" as const, dateSelected: "2025-03-25", author: "Dr. Johnson",
    },
    {
      id: "p1-s2", step: 2, name: "UV Protein Concentration Measurement",
      category: "method", objective: "Determine protein concentration using UV spectrophotometry.",
      method: "Standard Method", ready: true, protocolId: "#401",
      parametersState: "selected" as const, dateSelected: "2025-03-25", author: "Dr. Johnson",
    },
    {
      id: "p1-s3", step: 3, name: "SDS-PAGE",
      category: "method", objective: "Separate proteins by molecular weight using gel electrophoresis.",
      method: "Standard Method", ready: true, protocolId: "#303",
      parametersState: "configured" as const, dateSelected: "2025-03-18", author: "Dr. Johnson",
    },
    {
      id: "p1-s4", step: 4, name: "Western Blot",
      category: "method", objective: "Detect specific proteins using antibody-based detection.",
      method: "Standard Method", ready: true, protocolId: "#402",
      parametersState: "configured" as const, dateSelected: "2025-03-25", author: "Dr. Johnson",
    },
  ],
  p2: [
    {
      id: "p2-s1", step: 1, name: "Cell Lysis & Serum Preparation",
      category: "method", objective: "Prepare serum sample for affinity chromatography.",
      method: "Standard Method", ready: true, protocolId: "#501",
      parametersState: "configured" as const, dateSelected: "2025-01-20", author: "John Smith",
    },
    {
      id: "p2-s2", step: 2, name: "Protein A/G Column Binding",
      category: "method", objective: "Bind antibodies to Protein A/G affinity resin.",
      method: "Affinity Chromatography", ready: true, protocolId: "#502",
      parametersState: "configured" as const, dateSelected: "2025-01-20", author: "John Smith",
    },
    {
      id: "p2-s3", step: 3, name: "Wash & Elution",
      category: "method", objective: "Remove non-specific binding and elute purified antibody.",
      method: "Standard Method", ready: true, protocolId: "#503",
      parametersState: "selected" as const, dateSelected: "2025-01-22", author: "John Smith",
    },
    {
      id: "p2-s4", step: 4, name: "Buffer Exchange & Concentration",
      category: "module", objective: "Exchange elution buffer and concentrate antibody.",
      method: "Dialysis / Centrifugal Filter", ready: false, protocolId: undefined,
      parametersState: "none" as const, dateSelected: undefined, author: undefined,
    },
    {
      id: "p2-s5", step: 5, name: "Purity Assessment",
      category: "method", objective: "Verify antibody purity and integrity by SDS-PAGE.",
      method: "Standard Method", ready: true, protocolId: "#303",
      parametersState: "configured" as const, dateSelected: "2025-01-25", author: "John Smith",
    },
  ],
  p3: [
    {
      id: "p3-s1", step: 1, name: "Cell Seeding",
      category: "method", objective: "Seed cells into 96-well plate at defined density.",
      method: "Standard Method", ready: true, protocolId: "#601",
      parametersState: "configured" as const, dateSelected: "2025-02-01", author: "Dr. Williams",
    },
    {
      id: "p3-s2", step: 2, name: "Treatment Incubation",
      category: "method", objective: "Apply test compounds at varying concentrations.",
      method: "Standard Method", ready: true, protocolId: "#602",
      parametersState: "selected" as const, dateSelected: "2025-02-02", author: "Dr. Williams",
    },
    {
      id: "p3-s3", step: 3, name: "MTT Reagent Addition",
      category: "method", objective: "Add MTT reagent and incubate with cells.",
      method: "MTT Assay", ready: true, protocolId: "#603",
      parametersState: "configured" as const, dateSelected: "2025-02-03", author: "Sarah Chen",
    },
    {
      id: "p3-s4", step: 4, name: "Formazan Solubilization",
      category: "method", objective: "Dissolve formazan crystals with DMSO.",
      method: "MTT Assay", ready: true, protocolId: "#604",
      parametersState: "configured" as const, dateSelected: "2025-02-03", author: "Sarah Chen",
    },
    {
      id: "p3-s5", step: 5, name: "Absorbance Measurement",
      category: "method", objective: "Read absorbance at 570 nm on microplate reader.",
      method: "Spectrophotometry", ready: false, protocolId: undefined,
      parametersState: "none" as const, dateSelected: undefined, author: undefined,
    },
    {
      id: "p3-s6", step: 6, name: "Data Analysis & IC50 Calculation",
      category: "module", objective: "Calculate cell viability and IC50 values.",
      method: "Statistical Analysis", ready: false, protocolId: undefined,
      parametersState: "none" as const, dateSelected: undefined, author: undefined,
    },
  ],
}

export default function LibraryPipelinePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.folderId as string

  const [viewMode, setViewMode] = useState<"visual" | "list">("list")

  const { pipelines } = useTeam()

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
    })

  const pipeline = pipelines.find(p => p.id === id)

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

  const owner = getUserById(pipeline.ownerId)
  const steps = pipelineStepsMap[id] ?? []

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1200px] px-6 py-8">

            {/* ── Breadcrumb ────────────────────────────────────────── */}
            <Link
              href="/pipelines"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Pipelines
            </Link>

            {/* ── Page header ───────────────────────────────────────── */}
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
                  {owner?.name ?? "Unknown"} · {formatDate(pipeline.lastModified)}
                  {pipeline.shareCount > 0 && ` · Shared with ${pipeline.shareCount}`}
                </p>
              </div>

              <div className="flex items-center gap-2 mt-1 shrink-0">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
                  <Share2 className="mr-1.5 h-4 w-4" />
                  Share
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
                  <Download className="mr-1.5 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            {/* ── View toggle + steps count ─────────────────────────── */}
            <div className="flex items-center justify-between py-4 border-b border-gray-200 mb-0">
              <span className="text-sm text-gray-500">
                {steps.length} {steps.length === 1 ? "step" : "steps"}
              </span>

              <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                <button
                  className={cn(
                    "px-3 py-1.5 flex items-center text-sm transition-colors",
                    viewMode === "visual" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-600 hover:bg-gray-50",
                  )}
                  onClick={() => setViewMode("visual")}
                >
                  <LayoutGrid className="h-4 w-4 mr-1.5" />
                  Visual
                </button>
                <button
                  className={cn(
                    "px-3 py-1.5 flex items-center text-sm transition-colors",
                    viewMode === "list" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-600 hover:bg-gray-50",
                  )}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4 mr-1.5" />
                  List
                </button>
              </div>
            </div>

            {/* ── Steps content ─────────────────────────────────────── */}
            {steps.length === 0 ? (
              <div className="py-24 text-center">
                <p className="text-gray-500">No steps defined for this pipeline</p>
              </div>
            ) : viewMode === "visual" ? (
              <div className="mt-6">
                <StaticPipelineCanvas />
              </div>
            ) : (
              <PipelineListView
                steps={steps}
                onParametersClick={step => console.log("Parameters:", step)}
                onProtocolClick={step => console.log("Protocol:", step)}
                onBuffersClick={step => console.log("Buffers:", step)}
                onCalculationsClick={step => console.log("Calculations:", step)}
                onMaterialsClick={step => console.log("Materials:", step)}
                onPlanClick={step => console.log("Plan:", step)}
                hideColumns={['status', 'action']}
              />
            )}

          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
