"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, LayoutGrid, Plus } from "lucide-react"
import { useTeam } from "@/hooks/useTeam"
import Link from "next/link"

export default function MyPipelinesPage() {
  const { currentUser, pipelines } = useTeam()

  const myPipelines = pipelines.filter(p => p.ownerId === currentUser.id)

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
    })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1200px] px-6 py-8">

            {/* ── Page header ───────────────────────────────────────── */}
            <div className="flex items-end justify-between pb-6 border-b border-gray-200 mb-0">
              <div>
                <h1 className="text-[32px] font-semibold">Pipelines</h1>
                <p className="text-gray-500 mt-1">
                  {myPipelines.length} {myPipelines.length === 1 ? "pipeline" : "pipelines"}
                </p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New pipeline
              </Button>
            </div>

            {/* ── Column headers ────────────────────────────────────── */}
            <div className="flex items-center gap-4 -mx-6 px-6 py-2 border-b border-gray-100">
              <div className="h-5 w-5 shrink-0" />
              <div className="flex-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</div>
              <div className="w-20 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</div>
              <div className="w-32 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Modified</div>
              <div className="w-5 shrink-0" />
            </div>

            {/* ── Pipeline list ─────────────────────────────────────── */}
            {myPipelines.length === 0 ? (
              <div className="py-24 text-center">
                <LayoutGrid className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No pipelines yet</p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New pipeline
                </Button>
              </div>
            ) : (
              myPipelines.map(pipeline => (
                <Link
                  key={pipeline.id}
                  href={`/pipeline/${pipeline.id}`}
                  className="group flex items-center gap-4 py-3 border-b border-gray-100 hover:bg-gray-50 -mx-6 px-6 transition-colors"
                >
                  <LayoutGrid className="h-5 w-5 text-gray-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-900">{pipeline.name}</span>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{pipeline.description.goal}</p>
                  </div>
                  <div className="w-20 text-right">
                    {pipeline.isReady ? (
                      <Badge className="bg-green-100 text-green-700 border-0 text-xs">Ready</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">In progress</Badge>
                    )}
                  </div>
                  <div className="w-32 text-right">
                    <span className="text-sm text-gray-400">{formatDate(pipeline.lastModified)}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))
            )}

          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
