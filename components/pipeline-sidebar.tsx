"use client"

import type React from "react"

import { useState } from "react"
import { FlaskRound, Layers, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

// Define method and module types
interface MethodItem {
  id: string
  name: string
  description: string
}

interface PipelineSidebarProps {
  onAddMethod?: (method: MethodItem) => void
  onAddModule?: (module: MethodItem) => void
}

export function PipelineSidebar({ onAddMethod, onAddModule }: PipelineSidebarProps) {
  const [isMethodsDropdownOpen, setIsMethodsDropdownOpen] = useState(false)
  const [isModulesDropdownOpen, setIsModulesDropdownOpen] = useState(false)
  const [isModulesExpanded, setIsModulesExpanded] = useState(true)

  // Methods data
  const availableMethods = [
    {
      id: "pcr",
      name: "PCR",
      description: "Polymerase Chain Reaction for DNA amplification",
    },
    {
      id: "sds-page",
      name: "SDS-PAGE",
      description: "Sodium Dodecyl Sulfate Polyacrylamide Gel Electrophoresis for protein separation",
    },
    {
      id: "lcms",
      name: "LC/MS",
      description: "Liquid Chromatography-Mass Spectrometry for molecular analysis",
    },
    {
      id: "elisa",
      name: "ELISA",
      description: "Enzyme-Linked Immunosorbent Assay for detecting antibodies or antigens",
    },
    {
      id: "centrifugation",
      name: "Centrifugation",
      description: "Separate components by centrifugal force",
    },
  ]

  // Custom modules data
  const availableModules = [
    {
      id: "data-analysis",
      name: "Data Analysis",
      description: "Statistical analysis of experimental data",
    },
    {
      id: "visualization",
      name: "Visualization",
      description: "Data visualization tools",
    },
    {
      id: "reporting",
      name: "Reporting",
      description: "Generate automated reports",
    },
  ]

  // Handle method selection from dropdown
  const handleMethodSelect = (methodId: string) => {
    const selectedMethod = availableMethods.find((method) => method.id === methodId)
    if (selectedMethod && onAddMethod) {
      onAddMethod(selectedMethod)
    }
    setIsMethodsDropdownOpen(false)
  }

  // Handle module selection from dropdown
  const handleModuleSelect = (moduleId: string) => {
    const selectedModule = availableModules.find((module) => module.id === moduleId)
    if (selectedModule && onAddModule) {
      onAddModule(selectedModule)
    }
    setIsModulesDropdownOpen(false)
  }

  // Make items draggable from the sidebar
  const handleDragStart = (
    e: React.DragEvent,
    item: { id: string; type: "method" | "module"; name: string; description: string },
  ) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item))
    e.dataTransfer.effectAllowed = "copy"
  }

  return (
    <div className="w-64 border-r border-gray-200 flex flex-col">
      {/* Methods Dropdown */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center mb-2">
          <FlaskRound className="h-4 w-4 mr-2" />
          <span className="font-medium">Methods</span>
        </div>

        {/* Custom Select implementation to always show placeholder */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMethodsDropdownOpen(!isMethodsDropdownOpen)}
            className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            aria-haspopup="listbox"
            aria-expanded={isMethodsDropdownOpen}
            data-method-select
          >
            <span className="text-gray-500">Select a method...</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 opacity-50"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {isMethodsDropdownOpen && (
            <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white p-1 text-gray-950 shadow-md">
              <ul className="py-1" role="listbox">
                {availableMethods.length > 0 ? (
                  availableMethods.map((method) => (
                    <li
                      key={method.id}
                      role="option"
                      className="relative flex w-full cursor-default select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100"
                      onClick={() => handleMethodSelect(method.id)}
                      draggable
                      onDragStart={(e) => handleDragStart(e, { ...method, type: "method", ...method })}
                    >
                      <div>
                        <div className="font-medium">{method.name}</div>
                        <div className="text-xs text-gray-500">{method.description}</div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="relative flex w-full cursor-default select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none text-gray-500">
                    No methods available
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Display draggable method items */}
        <div className="mt-3 space-y-2">
          {availableMethods.slice(0, 3).map((method) => (
            <div
              key={method.id}
              className="p-2 bg-gray-50 rounded-md cursor-grab"
              draggable
              onDragStart={(e) => handleDragStart(e, { ...method, type: "method" })}
            >
              <div className="font-medium text-sm">{method.name}</div>
              <div className="text-xs text-gray-500">{method.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Modules Section */}
      <div className="border-b border-gray-200">
        <button
          className="w-full px-4 py-3 flex items-center justify-between text-left"
          onClick={() => setIsModulesExpanded(!isModulesExpanded)}
        >
          <div className="flex items-center">
            <Layers className="h-4 w-4 mr-2" />
            <span className="font-medium">Custom Modules</span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("transition-transform", isModulesExpanded ? "rotate-180" : "")}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {isModulesExpanded && (
          <div className="px-4 pb-4">
            {/* Custom Select implementation to always show placeholder */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsModulesDropdownOpen(!isModulesDropdownOpen)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                aria-haspopup="listbox"
                aria-expanded={isModulesDropdownOpen}
                data-module-select
              >
                <span className="text-gray-500">Select a module...</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 opacity-50"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {isModulesDropdownOpen && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white p-1 text-gray-950 shadow-md">
                  <ul className="py-1" role="listbox">
                    {availableModules.length > 0 ? (
                      availableModules.map((module) => (
                        <li
                          key={module.id}
                          role="option"
                          className="relative flex w-full cursor-default select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100"
                          onClick={() => handleModuleSelect(module.id)}
                          draggable
                          onDragStart={(e) => handleDragStart(e, { ...module, type: "module" })}
                        >
                          <div>
                            <div className="font-medium">{module.name}</div>
                            <div className="text-xs text-gray-500">{module.description}</div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="relative flex w-full cursor-default select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none text-gray-500">
                        No modules available
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Display draggable module items */}
            <div className="mt-3 space-y-2">
              {availableModules.slice(0, 2).map((module) => (
                <div
                  key={module.id}
                  className="p-2 bg-gray-50 rounded-md cursor-grab"
                  draggable
                  onDragStart={(e) => handleDragStart(e, { ...module, type: "module" })}
                >
                  <div className="font-medium text-sm">{module.name}</div>
                  <div className="text-xs text-gray-500">{module.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add New Method/Module Button */}
      <div className="p-4 mt-auto border-t border-gray-200">
        <button className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </button>
      </div>
    </div>
  )
}
