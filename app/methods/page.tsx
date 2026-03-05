"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { ChevronRight, FlaskConical, Folder, Plus } from "lucide-react"

// ── Data ─────────────────────────────────────────────────────────────────────

interface Method {
  id: string
  name: string
  description: string
  href: string
}

interface MethodFolder {
  id: string
  name: string
  methodCount: number
  methods: Method[]
}

const methodFolders: MethodFolder[] = [
  {
    id: "sds-page",
    name: "SDS-PAGE",
    methodCount: 3,
    methods: [
      {
        id: "sds-page-standard",
        name: "SDS-PAGE — Standard Reducing Conditions",
        description:
          "Denaturing gel electrophoresis under β-mercaptoethanol reduction to separate proteins by molecular weight in the 10–250 kDa range.",
        href: "/methods/sds-page/main",
      },
      {
        id: "sds-page-gradient",
        name: "SDS-PAGE — Gradient Gel (4–20%)",
        description:
          "Continuous gradient gel providing extended resolution across a broad molecular weight range from 10 to 500 kDa.",
        href: "/methods/sds-page/main",
      },
      {
        id: "sds-page-native",
        name: "SDS-PAGE — Non-Reducing (Native Conditions)",
        description:
          "Electrophoresis without reducing agent, preserving disulfide bonds to analyze antibody heavy/light chain assembly and intact complexes.",
        href: "/methods/sds-page/main",
      },
    ],
  },
  {
    id: "western-blot",
    name: "Western Blot",
    methodCount: 3,
    methods: [
      {
        id: "western-blot-chemiluminescent",
        name: "Western Blot — Chemiluminescent Detection (HRP)",
        description:
          "HRP-conjugated secondary antibody with ECL substrate for high-sensitivity protein detection on PVDF or nitrocellulose membranes.",
        href: "/methods/western-blot/protocol",
      },
      {
        id: "western-blot-fluorescent",
        name: "Western Blot — Fluorescent Multiplex Detection",
        description:
          "Near-infrared fluorophore-labeled secondary antibodies enabling simultaneous detection of two proteins on the same blot.",
        href: "/methods/western-blot/protocol",
      },
      {
        id: "western-blot-dot",
        name: "Western Blot — Dot Blot Variant",
        description:
          "Rapid sample spotting directly onto membrane, bypassing gel electrophoresis, for fast semi-quantitative antigen detection.",
        href: "/methods/western-blot/protocol",
      },
    ],
  },
  {
    id: "pcr",
    name: "PCR",
    methodCount: 4,
    methods: [
      {
        id: "pcr-standard",
        name: "PCR — Standard End-Point Amplification",
        description:
          "Conventional thermocycling to amplify target DNA sequences using Taq polymerase, verified by agarose gel electrophoresis.",
        href: "/methods/sds-page/main",
      },
      {
        id: "pcr-qpcr",
        name: "PCR — Quantitative Real-Time (qPCR)",
        description:
          "SYBR Green or TaqMan probe-based fluorescent detection enabling precise quantification of gene expression or copy number.",
        href: "/methods/sds-page/main",
      },
      {
        id: "pcr-rt",
        name: "PCR — Reverse Transcription (RT-PCR)",
        description:
          "Two-step cDNA synthesis from RNA template followed by standard PCR to detect and quantify mRNA expression.",
        href: "/methods/sds-page/main",
      },
      {
        id: "pcr-colony",
        name: "PCR — Colony Screening",
        description:
          "Direct lysis of bacterial colonies as template for rapid verification of correct insert in transformed clones.",
        href: "/methods/sds-page/main",
      },
    ],
  },
  {
    id: "elisa",
    name: "ELISA",
    methodCount: 3,
    methods: [
      {
        id: "elisa-sandwich",
        name: "ELISA — Sandwich (Capture) Format",
        description:
          "Dual-antibody sandwich assay for quantitative detection of soluble antigens such as cytokines and growth factors in serum or cell supernatant.",
        href: "/methods/sds-page/main",
      },
      {
        id: "elisa-direct",
        name: "ELISA — Direct Antigen Coating",
        description:
          "Antigen directly adsorbed to plate, detected with a single labeled antibody; suitable for antibody titer measurement.",
        href: "/methods/sds-page/main",
      },
      {
        id: "elisa-competitive",
        name: "ELISA — Competitive Inhibition Assay",
        description:
          "Signal inversely proportional to analyte concentration; used for small molecules, haptens, and drugs in complex matrices.",
        href: "/methods/sds-page/main",
      },
    ],
  },
  {
    id: "mass-spec",
    name: "Mass Spectrometry",
    methodCount: 3,
    methods: [
      {
        id: "ms-lc-msms",
        name: "Mass Spectrometry — LC-MS/MS Proteomics",
        description:
          "Nano-flow liquid chromatography coupled to tandem mass spectrometry for bottom-up identification and quantification of complex protein mixtures.",
        href: "/methods/sds-page/main",
      },
      {
        id: "ms-maldi",
        name: "Mass Spectrometry — MALDI-TOF Intact Mass",
        description:
          "Matrix-assisted laser desorption ionization for rapid intact protein mass measurement and quality control of biopharmaceuticals.",
        href: "/methods/sds-page/main",
      },
      {
        id: "ms-targeted-mrm",
        name: "Mass Spectrometry — Targeted MRM / PRM",
        description:
          "Multiple reaction monitoring for absolute quantification of predefined peptides as biomarkers or in pharmacokinetic studies.",
        href: "/methods/sds-page/main",
      },
    ],
  },
]

// ── Page ─────────────────────────────────────────────────────────────────────

export default function MethodsPage() {
  const [expandedFolderId, setExpandedFolderId] = useState<string | null>(null)

  const toggleFolder = (folderId: string) => {
    setExpandedFolderId(prev => (prev === folderId ? null : folderId))
  }

  const totalMethods = methodFolders.reduce((sum, f) => sum + f.methodCount, 0)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1200px] px-6 py-8">

            {/* ── Page header ─────────────────────────────────────────── */}
            <div className="flex items-end justify-between pb-6 border-b border-gray-200 mb-0">
              <div>
                <h1 className="text-[32px] font-semibold">Methods</h1>
                <p className="text-gray-500 mt-1">
                  {totalMethods} {totalMethods === 1 ? "method" : "methods"} across {methodFolders.length} groups
                </p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New method
              </Button>
            </div>

            {/* ── Column headers ──────────────────────────────────────── */}
            <div className="flex items-center gap-4 -mx-6 px-6 py-2 border-b border-gray-100">
              <div className="h-5 w-5 shrink-0" />
              <div className="flex-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</div>
              <div className="w-24 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Methods</div>
              <div className="w-5 shrink-0" />
            </div>

            {/* ── Folder rows ─────────────────────────────────────────── */}
            {methodFolders.map(folder => {
              const isExpanded = expandedFolderId === folder.id

              return (
                <div key={folder.id}>
                  {/* Folder row */}
                  <button
                    onClick={() => toggleFolder(folder.id)}
                    className="group flex items-center gap-4 w-full py-3 border-b border-gray-100 hover:bg-gray-50 -mx-6 px-6 transition-colors text-left"
                    aria-expanded={isExpanded}
                  >
                    <Folder className="h-5 w-5 text-gray-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-900">{folder.name}</span>
                    </div>
                    <div className="w-24 text-right">
                      <span className="text-xs text-gray-400">{folder.methodCount} methods</span>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                        isExpanded ? "rotate-90" : "opacity-0 group-hover:opacity-100"
                      }`}
                    />
                  </button>

                  {/* Expanded method rows */}
                  {isExpanded && (
                    <div className="bg-gray-50">
                      {folder.methods.map((method, index) => (
                        <Link
                          key={method.id}
                          href={method.href}
                          className={`group flex items-center gap-4 py-3 -mx-6 px-6 hover:bg-gray-100 transition-colors ${
                            index < folder.methods.length - 1
                              ? "border-b border-gray-100"
                              : "border-b border-gray-200"
                          }`}
                        >
                          {/* Method icon — indent to align with folder name */}
                          <div className="h-5 w-5 shrink-0" />
                          <div className="h-8 w-8 rounded-md bg-white border border-gray-200 flex items-center justify-center shrink-0">
                            <FlaskConical className="h-4 w-4 text-gray-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 leading-snug">
                              {method.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-1">
                              {method.description}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
