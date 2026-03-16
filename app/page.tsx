"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { ChevronRight, Check } from "lucide-react"

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

export default function ScientificMethodManager() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<"methods" | "materials">("methods")
  const [searchQuery, setSearchQuery] = useState("")
  const [object, setObject] = useState("")
  const [application, setApplication] = useState("")
  const [showMoleculeSubmenu, setShowMoleculeSubmenu] = useState(false)

  const handleSearch = () => {
    const searchParams = new URLSearchParams()
    if (searchQuery) searchParams.append("query", searchQuery)
    if (object) searchParams.append("object", object)
    if (application) searchParams.append("application", application)
    router.push(`/plyowsearchresults?${searchParams.toString()}`)
  }

  const handleApplyFilters = () => {
    const searchParams = new URLSearchParams()
    if (object) searchParams.append("object", object)
    if (application) searchParams.append("application", application)
    router.push(`/plyowsearchresults?${searchParams.toString()}`)
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 flex flex-col">
        {/* Section Tabs - Pill style matching the image */}
        <div className="w-full bg-white pt-8 pb-6">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex">
              {/* METHODS Tab */}
              <button
                onClick={() => setActiveSection("methods")}
                className={cn(
                  "relative px-16 py-3 text-base font-semibold uppercase tracking-wide rounded-t-lg transition-colors",
                  activeSection === "methods"
                    ? "bg-[#F5F0E6] text-gray-800 border-l-4 border-l-[#C9A94E]"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                )}
              >
                Methods
              </button>
              {/* MATERIALS Tab */}
              <button
                onClick={() => setActiveSection("materials")}
                className={cn(
                  "relative px-16 py-3 text-base font-semibold uppercase tracking-wide rounded-t-lg transition-colors",
                  activeSection === "materials"
                    ? "bg-[#F5F0E6] text-gray-800 border-l-4 border-l-[#C9A94E]"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                )}
              >
                Materials
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            {activeSection === "methods" ? (
              /* Methods Section */
              <div className="space-y-4 pt-6">
                {/* Search Row */}
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Protein qualitative analysis"
                    className="flex-1 h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch()
                    }}
                  />
                  <Button 
                    className="h-12 bg-blue-600 hover:bg-blue-700 px-8 min-w-[100px]" 
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </div>

                {/* Filters Row */}
                <div className="flex items-center gap-4">
                  <Select value={object} onValueChange={handleObjectSelect}>
                    <SelectTrigger className="h-12 flex-1">
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
                    <SelectTrigger className="h-12 flex-1">
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
                    className="h-12 bg-blue-600 hover:bg-blue-700 text-white px-6"
                    onClick={handleApplyFilters}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            ) : (
              /* Materials Section - placeholder for now */
              <div className="pt-6">
                <p className="text-gray-500">Materials catalog coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
