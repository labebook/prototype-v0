"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Layers, Plus, Share2 } from "lucide-react"
import Link from "next/link"

interface CustomModule {
  id: string
  name: string
  slug: string
  description: string
  createdDate: string
  createdBy: string
  type: string
  status: "Ready" | "Draft" | "In Progress"
}

const sampleModules: CustomModule[] = [
  {
    id: "module-1",
    name: "Whole-Cell Protein Lysate Preparation Using Detergent-Based Buffer",
    slug: "whole-cell-lysate-preparation-suspension-cells",
    description: "Standardized module for lysate preparation from suspension cells prior to Western blot analysis.",
    createdDate: "2025-03-25",
    createdBy: "Dr. Johnson",
    type: "Preparation Module",
    status: "Ready",
  },
]

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
  })

export default function CustomModulesPage() {
  const [modules] = useState(sampleModules)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1200px] px-6 py-8">

            {/* ── Page header ───────────────────────────────────────── */}
            <div className="flex items-end justify-between pb-6 border-b border-gray-200 mb-8">
              <div>
                <h1 className="text-[32px] font-semibold">Custom Modules</h1>
                <p className="text-gray-500 mt-1">
                  {modules.length} {modules.length === 1 ? "module" : "modules"}
                </p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New module
              </Button>
            </div>

            {/* ── Modules list ──────────────────────────────────────── */}
            {modules.length === 0 ? (
              <div className="py-24 text-center">
                <Layers className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No custom modules yet</p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New module
                </Button>
              </div>
            ) : (
              <div>
                {modules.map(module => (
                  <div
                    key={module.id}
                    className="group flex items-center gap-6 py-5 border-b border-gray-200 hover:bg-gray-50 -mx-6 px-6 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/custom-modules/${module.slug}`}
                        className="text-base font-medium text-gray-900 hover:underline"
                        onClick={e => e.stopPropagation()}
                      >
                        {module.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-0.5">{module.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{module.type} · {module.createdBy}</p>
                    </div>

                    <div className="shrink-0">
                      {module.status === "Ready" ? (
                        <Badge className="bg-green-100 text-green-700 border-0 text-xs">{module.status}</Badge>
                      ) : module.status === "Draft" ? (
                        <Badge variant="outline" className="text-xs">{module.status}</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">{module.status}</Badge>
                      )}
                    </div>

                    <div className="text-sm text-gray-400 shrink-0 w-28 text-right">
                      {formatDate(module.createdDate)}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-700 shrink-0"
                    >
                      <Share2 className="mr-1.5 h-4 w-4" />
                      Share
                    </Button>

                    <ChevronRight className="h-4 w-4 text-gray-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
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
