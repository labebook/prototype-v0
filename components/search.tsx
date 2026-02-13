"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

// Object dropdown options
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
  "Molecule",
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

interface SearchProps {
  initialQuery?: string
  initialObject?: string
  initialApplication?: string
}

export function Search({ initialQuery = "", initialObject = "", initialApplication = "" }: SearchProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [object, setObject] = useState(initialObject)
  const [application, setApplication] = useState(initialApplication)

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

  return (
    <div className="flex flex-col items-center space-y-8 w-full">
      {/* Search Row */}
      <div className="flex justify-center w-full max-w-3xl">
        <div className="flex items-center gap-4 w-full">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search methods..."
              className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch()
                }
              }}
            />
          </div>
          <Button className="h-12 bg-black hover:bg-gray-800 px-4 min-w-[100px]" onClick={handleSearch}>
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
        <Select value={object} onValueChange={setObject}>
          <SelectTrigger className="h-12 w-[280px]">
            <SelectValue placeholder="Object" />
          </SelectTrigger>
          <SelectContent>
            {objectOptions.map((option) => (
              <SelectItem key={option} value={option.toLowerCase().replace(/\s+/g, "-")}>
                {option}
              </SelectItem>
            ))}
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
