"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Plus, Share2 } from "lucide-react"
import Link from "next/link"

const sampleMethods = [
  {
    id: "M001",
    name: "SDS-PAGE",
    description: "Sodium dodecyl sulfate–polyacrylamide gel electrophoresis",
    status: "favorite",
    lastModified: "2025-03-22",
    link: "/methods/sds-page/theory",
  },
  {
    id: "M002",
    name: "Western Blot",
    description: "Protein detection technique using antibodies",
    status: "saved",
    lastModified: "2025-03-18",
    link: "#",
  },
  {
    id: "M003",
    name: "PCR",
    description: "Polymerase chain reaction for DNA amplification",
    status: "working",
    lastModified: "2025-03-15",
    link: "#",
  },
  {
    id: "M004",
    name: "ELISA",
    description: "Enzyme-linked immunosorbent assay",
    status: "saved",
    lastModified: "2025-03-10",
    link: "#",
  },
  {
    id: "M005",
    name: "Mass Spectrometry",
    description: "Analytical technique to measure mass-to-charge ratio of ions",
    status: null,
    lastModified: "2025-02-28",
    link: "#",
  },
]

export default function MethodsPage() {
  const [methods] = useState(sampleMethods)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1200px] px-6 py-8">

            {/* ── Page header ───────────────────────────────────────── */}
            <div className="flex items-end justify-between mb-8 pb-6 border-b border-gray-200">
              <div>
                <h1 className="text-[32px] font-semibold">Methods</h1>
                <p className="text-gray-500 mt-1">
                  Browse and manage your collection of scientific methods
                </p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New method
              </Button>
            </div>

            {/* ── Methods list ──────────────────────────────────────── */}
            {methods.length === 0 ? (
              <div className="py-24 text-center">
                <p className="text-lg font-medium text-gray-700 mb-1">No methods yet</p>
                <p className="text-gray-500 mb-6">Get started by creating your first method</p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New method
                </Button>
              </div>
            ) : (
              <div>
                {methods.map(method => (
                  <div
                    key={method.id}
                    className="group flex items-center gap-6 py-5 border-b border-gray-200 hover:bg-gray-50 -mx-6 px-6 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <Link
                        href={method.link}
                        className="text-base font-medium text-gray-900 hover:underline"
                        onClick={e => e.stopPropagation()}
                      >
                        {method.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-0.5">{method.description}</p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-700 shrink-0"
                    >
                      <Share2 className="mr-1.5 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                ))}
              </div>
            )}

          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
