"use client"

import { useState } from "react"
import { Search } from "@/components/search-home"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { cn } from "@/lib/utils"
import { 
  Beaker, 
  FlaskConical, 
  Package, 
  Microscope, 
  Monitor, 
  FileText,
  ChevronRight
} from "lucide-react"

// Materials catalog categories
const materialCategories = [
  {
    id: "equipment",
    name: "Equipment",
    description: "Laboratory instruments and equipment",
    icon: Microscope,
    itemCount: 156,
  },
  {
    id: "chemicals",
    name: "Chemicals",
    description: "Reagents, solvents, and chemical compounds",
    icon: FlaskConical,
    itemCount: 892,
  },
  {
    id: "supplies",
    name: "Supplies",
    description: "Consumables and laboratory supplies",
    icon: Package,
    itemCount: 423,
  },
  {
    id: "objects",
    name: "Objects",
    description: "Biological objects and specimens",
    icon: Beaker,
    itemCount: 234,
  },
  {
    id: "software",
    name: "Software",
    description: "Analysis and laboratory software tools",
    icon: Monitor,
    itemCount: 87,
  },
  {
    id: "formulations",
    name: "Formulations",
    description: "Buffer recipes and standard formulations",
    icon: FileText,
    itemCount: 312,
  },
]

export default function ScientificMethodManager() {
  const [activeSection, setActiveSection] = useState<"methods" | "materials">("methods")

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 flex flex-col">
        {/* Section Tabs */}
        <div className="w-full border-b border-gray-200 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveSection("methods")}
                className={cn(
                  "py-4 px-2 text-base font-medium border-b-2 transition-colors",
                  activeSection === "methods"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                Methods
              </button>
              <button
                onClick={() => setActiveSection("materials")}
                className={cn(
                  "py-4 px-2 text-base font-medium border-b-2 transition-colors",
                  activeSection === "materials"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                Materials
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
          {activeSection === "methods" ? (
            /* Methods Section - Keep existing search/filter UI */
            <>
              <section className="text-center mb-12">
                <h1 className="text-3xl font-semibold mb-4">Experimental Methods Library</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Search methods, procedures, and protocols for building experimental pipelines.
                </p>
              </section>

              <section className="w-full max-w-3xl">
                <Search />
              </section>
            </>
          ) : (
            /* Materials Section - Catalog style */
            <>
              <section className="text-center mb-12">
                <h1 className="text-3xl font-semibold mb-4">Materials Catalog</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Browse equipment, chemicals, supplies, and other materials for your experiments.
                </p>
              </section>

              <section className="w-full max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {materialCategories.map((category) => {
                    const IconComponent = category.icon
                    return (
                      <button
                        key={category.id}
                        className="group flex flex-col p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all text-left"
                        onClick={() => {
                          // Navigate to materials category (placeholder)
                          console.log(`Navigate to materials/${category.id}`)
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <IconComponent className="h-6 w-6 text-blue-600" />
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                          {category.description}
                        </p>
                        <span className="text-xs text-gray-400">
                          {category.itemCount} items
                        </span>
                      </button>
                    )
                  })}
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
