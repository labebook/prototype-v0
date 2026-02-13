"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Edit, Plus, Share2, ArrowLeft, Trash2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Pipeline {
  id: string
  name: string
  createdDate: string
  createdBy: string
  moduleCount: number
  isReady: boolean
  link: string
}

const westernBlotPipelines: Pipeline[] = [
  {
    id: "western-blot-pipeline",
    name: "Western Blot Pipeline",
    createdDate: "2025-03-25",
    createdBy: "Dr. Johnson",
    moduleCount: 3,
    isReady: true,
    link: "/pipelines/western-blot/western-blot-pipeline",
  },
]

export default function WesternBlotFolderPage() {
  const router = useRouter()
  const [pipelines] = useState(westernBlotPipelines)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 py-8 px-4">
          <div className="container mx-auto max-w-7xl">
            {/* Breadcrumb */}
            <div className="mb-4 text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900">
                Home
              </Link>
              <span className="mx-2">›</span>
              <Link href="/pipelines" className="hover:text-gray-900">
                Pipelines
              </Link>
              <span className="mx-2">›</span>
              <span className="text-gray-900">Western Blot</span>
            </div>

            {/* Title and Actions */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <div className="flex items-center mb-2">
                  <button
                    onClick={() => router.push("/pipelines")}
                    className="mr-3 p-1 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <h1 className="text-3xl font-semibold">Western Blot</h1>
                </div>
                <p className="text-lg text-gray-600">{pipelines.length} pipelines in this folder</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button className="h-12 bg-black hover:bg-gray-800 text-white border-0 px-4">
                  <Plus className="mr-2 h-4 w-4" /> New Pipeline
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              {pipelines.length > 0 ? (
                pipelines.map((pipeline) => (
                  <div
                    key={pipeline.id}
                    className="group flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors"
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <Link
                        href={pipeline.link}
                        className="flex items-center flex-1 min-w-0 hover:text-blue-600 transition-colors"
                      >
                        <span className="font-medium text-lg truncate mr-4">{pipeline.name}</span>
                        <span className="text-sm text-gray-500 mr-4 flex-shrink-0">
                          Created: {pipeline.createdDate}
                        </span>
                        <span className="text-sm text-gray-500 mr-4 flex-shrink-0">By: {pipeline.createdBy}</span>
                        <span className="text-sm text-gray-500 mr-4 flex-shrink-0">{pipeline.moduleCount} modules</span>
                        <div className="flex items-center flex-shrink-0">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${pipeline.isReady ? "bg-green-500" : "bg-red-500"}`}
                          ></div>
                          <span className="text-sm text-gray-500">{pipeline.isReady ? "Ready" : "Not Ready"}</span>
                        </div>
                      </Link>
                    </div>

                    {/* Action buttons - shown on hover */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Share</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="bg-gray-100 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
                    <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">No pipelines in this folder</h3>
                  <p className="text-gray-500 mb-6">Create a new pipeline to get started.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
