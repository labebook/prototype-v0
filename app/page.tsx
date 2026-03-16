"use client"

import { useState, Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronRight, Check, Beaker, FlaskConical, Package, Box, Monitor, FileText, Folder } from "lucide-react"

// Object dropdown options with nested structure
const objectOptions = [
  "Cell",
  "Organelle",
  "Cell culture",
  "Tissue",
  "Organ",
  "Virus",
  "Prokaryote",
  "Plant",
  "Animal",
  "Human biospecimen",
  {
    label: "Molecule",
    value: "molecule",
    subOptions: ["DNA", "RNA", "Small Molecule", "Peptide", "Protein"],
  },
  "Protist",
  "Fungi",
  "Genetic Material",
  "Other",
]

// Application dropdown options
const applicationOptions = [
  "Analysis",
  "Structural Analysis",
  "Determination of Impurities",
  "Small Molecule Identification",
  "Semi-Quantitative Analysis",
  "Quantitative Analysis",
  "Qualitative Analysis",
  "Isolation and Purification",
  "Drying",
]

// Materials categories for sidebar
const materialsCategories = [
  { id: "equipment", label: "Equipment", icon: Beaker },
  { id: "chemicals", label: "Chemicals", icon: FlaskConical },
  { id: "supplies", label: "Supplies", icon: Package },
  { id: "objects", label: "Objects", icon: Box },
  { id: "software", label: "Software", icon: Monitor },
  { id: "preparations", label: "Preparations", icon: FileText },
]

// Equipment subcategories
const equipmentItems = [
  { id: "gel-electrophoresis", label: "Gel Electrophoresis Equipment" },
  { id: "basic-lab", label: "Basic Lab Equipment" },
  { id: "micropipettes", label: "Micropipettes" },
  { id: "microcentrifuge", label: "Benchtop Microcentrifuge" },
  { id: "spectrophotometer", label: "UV-Vis Spectrophotometer" },
  { id: "cooling-rack", label: "Cooling Rack PCR" },
  { id: "laboratory-marker", label: "Laboratory Marker" },
  { id: "vortex-mixer", label: "Vortex Mixer" },
]

function HomePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeSection = searchParams.get("section") || "methods"
  
  const [searchQuery, setSearchQuery] = useState("")
  const [object, setObject] = useState("")
  const [application, setApplication] = useState("")
  const [showMoleculeSubmenu, setShowMoleculeSubmenu] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("equipment")

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.append("query", searchQuery)
    if (object) params.append("object", object)
    if (application) params.append("application", application)
    router.push(`/plyowsearchresults?${params.toString()}`)
  }

  const handleApplyFilters = () => {
    const params = new URLSearchParams()
    if (object) params.append("object", object)
    if (application) params.append("application", application)
    router.push(`/plyowsearchresults?${params.toString()}`)
  }

  const handleObjectSelect = (value: string) => {
    if (value === "molecule") {
      setShowMoleculeSubmenu(true)
      return
    }
    setObject(value)
    setShowMoleculeSubmenu(false)
  }

  const handleMoleculeSubSelect = (value: string) => {
    setObject(value.toLowerCase().replace(/\s+/g, "-"))
    setShowMoleculeSubmenu(false)
  }

  const getDisplayValue = () => {
    if (!object) return "Object"
    const moleculeOption = objectOptions.find((opt) => typeof opt === "object" && opt.value === "molecule")
    if (moleculeOption && typeof moleculeOption === "object") {
      const subOption = moleculeOption.subOptions.find((sub) => sub.toLowerCase().replace(/\s+/g, "-") === object)
      if (subOption) return subOption
    }
    return object
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Get current category info
  const currentCategory = materialsCategories.find(c => c.id === selectedCategory)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {activeSection === "methods" ? (
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-2xl">
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
              Scientific Method Manager
            </h1>

            {/* Subtitle */}
            <p className="text-base text-gray-600 text-center mb-10 leading-relaxed">
              Search, organize, and build pipelines<br />
              with scientific methods from our comprehensive library.
            </p>

            {/* Search Row */}
            <div className="flex items-center gap-3 mb-6">
              <input
                type="text"
                placeholder="Search methods..."
                className="flex-1 h-11 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch()
                }}
              />
              <Button 
                className="h-11 bg-blue-500 hover:bg-blue-600 px-6 text-sm font-medium" 
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>

            {/* OR Separator */}
            <div className="text-center text-gray-400 text-sm mb-6">
              OR
            </div>

            {/* Filters Row */}
            <div className="flex items-center gap-3">
              <Select value={object} onValueChange={handleObjectSelect}>
                <SelectTrigger className="h-11 flex-1 bg-white">
                  <SelectValue placeholder="Object">{getDisplayValue()}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {objectOptions.map((option) => {
                    if (typeof option === "string") {
                      const value = option.toLowerCase().replace(/\s+/g, "-")
                      return (
                        <SelectItem key={option} value={value}>
                          <div className="flex items-center justify-between w-full">
                            <span>{option}</span>
                            {object === value && <Check className="h-4 w-4" />}
                          </div>
                        </SelectItem>
                      )
                    } else {
                      return (
                        <div key={option.value}>
                          <SelectItem value={option.value} className="cursor-pointer">
                            <div className="flex items-center justify-between w-full">
                              <span>{option.label}</span>
                              <ChevronRight className="h-4 w-4" />
                            </div>
                          </SelectItem>
                          {showMoleculeSubmenu && (
                            <div className="ml-4 border-l border-gray-200">
                              {option.subOptions.map((subOption) => {
                                const subValue = subOption.toLowerCase().replace(/\s+/g, "-")
                                return (
                                  <SelectItem
                                    key={subOption}
                                    value={subValue}
                                    className="pl-4 cursor-pointer"
                                    onSelect={() => handleMoleculeSubSelect(subOption)}
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <span>{subOption}</span>
                                      {object === subValue && <Check className="h-4 w-4" />}
                                    </div>
                                  </SelectItem>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    }
                  })}
                </SelectContent>
              </Select>

              <Select value={application} onValueChange={setApplication}>
                <SelectTrigger className="h-11 flex-1 bg-white">
                  <SelectValue placeholder="Application" />
                </SelectTrigger>
                <SelectContent>
                  {applicationOptions.map((option) => (
                    <SelectItem key={option} value={option.toLowerCase().replace(/\s+/g, "-")}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                className="h-11 bg-blue-500 hover:bg-blue-600 text-white px-5 text-sm font-medium"
                onClick={handleApplyFilters}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </main>
      ) : (
        /* Materials Section with Sidebar */
        <div className="flex-1 flex min-h-0">
          {/* Left Sidebar - Materials Categories */}
          <aside className="w-64 border-r border-gray-200 h-full flex flex-col bg-white">
            <nav className="py-2 flex-1">
              <ul className="space-y-1">
                {materialsCategories.map((category) => {
                  const Icon = category.icon
                  const isSelected = selectedCategory === category.id
                  
                  return (
                    <li key={category.id}>
                      <button
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center w-full px-4 py-2.5 text-sm text-left transition-colors ${
                          isSelected
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {category.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-white">
            <div className="mx-auto max-w-[1200px] px-6 py-8">
              {/* Page header */}
              <div className="flex items-end justify-between mb-8 pb-6 border-b border-gray-200">
                <div>
                  <h1 className="text-[32px] font-semibold">{currentCategory?.label}</h1>
                  <p className="text-gray-500 mt-1">
                    Browse {currentCategory?.label.toLowerCase()} in the materials library
                  </p>
                </div>
              </div>

              {/* Content */}
              {selectedCategory === "equipment" ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {equipmentItems.map((item) => (
                    <button
                      key={item.id}
                      className="flex flex-col items-center p-6 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors text-center group"
                      onClick={() => console.log(`Navigate to ${item.id}`)}
                    >
                      <Folder className="h-12 w-12 text-amber-400 mb-3 group-hover:text-amber-500 transition-colors" />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 leading-tight">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center">
                  {currentCategory && (
                    <>
                      <currentCategory.icon className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-700 mb-1">
                        No {currentCategory.label.toLowerCase()} yet
                      </p>
                      <p className="text-gray-500">
                        {currentCategory.label} will appear here once added to the library.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default function ScientificMethodManager() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  )
}
