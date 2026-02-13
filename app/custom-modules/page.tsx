"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Plus, Upload, Edit, Share2, Trash2, Layers } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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

export default function CustomModulesPage() {
  const [modules] = useState(sampleModules)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 py-8 px-4">
          <div className="container mx-auto max-w-7xl">
            {/* Title and Actions */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-semibold mb-2">Custom Modules</h1>
                <p className="text-lg text-gray-600">
                  Create, manage, and reuse domain-specific building blocks for your experimental pipelines.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  className="h-12 bg-white border-gray-300 hover:bg-gray-50 text-gray-700 px-4"
                  asChild
                >
                  <Link href="/custom-modules/import">
                    <Upload className="mr-2 h-4 w-4" /> Import Module
                  </Link>
                </Button>
                <Button className="h-12 bg-black hover:bg-gray-800 text-white border-0 px-4" asChild>
                  <Link href="/custom-modules/new">
                    <Plus className="mr-2 h-4 w-4" /> New Module
                  </Link>
                </Button>
              </div>
            </div>

            {/* Modules List */}
            <div className="space-y-1">
              {modules.length > 0 ? (
                modules.map((module) => (
                  <div
                    key={module.id}
                    className="group flex items-start justify-between p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/custom-modules/${module.slug}`}
                        className="block hover:text-blue-600 transition-colors"
                      >
                        <h3 className="font-medium text-lg mb-2">{module.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Created: {module.createdDate}</span>
                          <span>By: {module.createdBy}</span>
                          <span>Type: {module.type}</span>
                          <div className="flex items-center">
                            <div
                              className={`w-2 h-2 rounded-full mr-2 ${
                                module.status === "Ready"
                                  ? "bg-green-500"
                                  : module.status === "Draft"
                                    ? "bg-yellow-500"
                                    : "bg-blue-500"
                              }`}
                            ></div>
                            <span>Status: {module.status}</span>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Action buttons - shown on hover */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
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
                    <Layers className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No custom modules found</h3>
                  <p className="text-gray-500 mb-6">Get started by creating your first custom module</p>
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
