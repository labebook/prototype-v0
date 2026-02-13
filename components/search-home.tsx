"use client"

import { useState } from "react"
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

export function Search() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [object, setObject] = useState("")
  const [application, setApplication] = useState("")
  const [showMoleculeSubmenu, setShowMoleculeSubmenu] = useState(false)

  const handleSearch = () => {
    // Create a URL-friendly search parameters string
    const searchParams = new URLSearchParams()

    if (searchQuery) {
      searchParams.append("query", searchQuery)
    }

    if (object) {
      searchParams.append("object", object)
    }

    if (application) {
      searchParams.append("application", application)
    }

    // Navigate to the search results page
    router.push(`/plyowsearchresults?${searchParams.toString()}`)
  }

  const handleApplyFilters = () => {
    // Create a URL-friendly search parameters string with just the filters
    const searchParams = new URLSearchParams()

    if (object) {
      searchParams.append("object", object)
    }

    if (application) {
      searchParams.append("application", application)
    }

    // Navigate to the search results page
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

    // Check if it's a molecule sub-option
    const moleculeOption = objectOptions.find((opt) => typeof opt === "object" && opt.value === "molecule")
    if (moleculeOption && typeof moleculeOption === "object") {
      const subOption = moleculeOption.subOptions.find((sub) => sub.toLowerCase().replace(/\s+/g, "-") === object)
      if (subOption) return subOption
    }

    // Convert back to display format
    return object
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="flex flex-col items-center space-y-8 w-full">
      {/* Search Row */}
      <div className="flex justify-center w-full max-w-3xl">
        <div className="flex items-center gap-4 w-full">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search methods..."
              className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch()
                }
              }}
            />
          </div>
          <Button className="h-12 bg-blue-600 hover:bg-blue-700 px-4 min-w-[100px]" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>

      {/* OR Separator */}
      <div className="flex items-center justify-center w-full py-4">
        <span className="text-[#6B7280] text-xl font-medium uppercase">OR</span>
      </div>

      {/* Filters Row */}
      <div className="flex justify-center items-center gap-4 w-full flex-wrap">
        <Select value={object} onValueChange={handleObjectSelect}>
          <SelectTrigger className="h-12 w-[280px]">
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
                // Handle nested Molecule option
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
          <SelectTrigger className="h-12 w-[280px]">
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
          variant="secondary"
          className="h-12 bg-blue-600 hover:bg-blue-700 text-white px-4 min-w-[140px]"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  )
}
