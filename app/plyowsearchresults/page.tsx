"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

// Sample result data
const sampleResults = [
  {
    id: 1,
    title: "1. Western Blot",
    description:
      "Western blot is an analytical technique used to detect specific proteins in a sample through gel electrophoresis and antibody-based detection.",
    isFavorite: false,
    link: "/methods/western-blot/theory",
  },
  {
    id: 2,
    title: "2. Eastern Blotting",
    description:
      "Eastern blotting is a biochemical technique used to analyze protein post-translational modifications such as lipids, phosphomoieties, and glycoconjugates.",
    isFavorite: false,
    link: "#",
  },
  {
    id: 3,
    title: "3. Northern Blotting",
    description:
      "Northern blotting is a technique used to study gene expression by detecting RNA in a sample through gel electrophoresis and hybridization with labeled probes.",
    isFavorite: false,
    link: "#",
  },
  {
    id: 4,
    title: "4. Southern Blotting",
    description:
      "Southern blotting is a method used to detect specific DNA sequences in DNA samples through gel electrophoresis and hybridization with labeled probes.",
    isFavorite: false,
    link: "#",
  },
  {
    id: 5,
    title: "5. Dot Blot",
    description:
      "Dot blot is a simplified technique for detecting, analyzing, and identifying proteins without the need for gel electrophoresis, using direct application to a membrane.",
    isFavorite: true,
    link: "#",
  },
  {
    id: 6,
    title: "6. SDS-PAGE",
    description:
      "SDS-PAGE (sodium dodecylsulphate-polyacrylamide gel electrophoresis), is a discontinuous electrophoretic system developed by Ulrich K. Laemmli which is commonly used as a method to separate proteins with molecular masses between 5 and 250 kDa.",
    isFavorite: false,
    link: "/methods/sds-page/theory",
  },
]

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

export default function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || "Protein qualitative analysis"
  const object = searchParams.get("object") || ""
  const application = searchParams.get("application") || ""

  const [results, setResults] = useState(sampleResults)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(query)
  const [selectedObject, setSelectedObject] = useState(object)
  const [selectedApplication, setSelectedApplication] = useState(application)

  useEffect(() => {
    // Simulate loading search results
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const toggleFavorite = (id: number) => {
    setResults(results.map((result) => (result.id === id ? { ...result, isFavorite: !result.isFavorite } : result)))
  }

  const handleSearch = () => {
    // In a real app, this would trigger a new search
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-8 text-center">
          <div className="container mx-auto max-w-7xl px-4">
            <h1 className="text-3xl font-semibold mb-4">Scientific Method Manager</h1>
            <p className="text-lg max-w-3xl mx-auto">
              Search, organize, and build pipelines
              <br />
              with scientific methods from our comprehensive library.
            </p>
          </div>
        </section>

        {/* Search & Filters */}
        <div className="container mx-auto max-w-7xl px-4 mb-8">
          <div className="flex flex-col space-y-4">
            {/* Search Row */}
            <div className="flex items-center gap-4">
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

            {/* Filters Row */}
            <div className="flex items-center gap-4">
              <Select value={selectedObject} onValueChange={setSelectedObject}>
                <SelectTrigger className="h-12 flex-1">
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

              <Select value={selectedApplication} onValueChange={setSelectedApplication}>
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
                variant="secondary"
                className="h-12 bg-blue-600 hover:bg-blue-700 text-white px-4 min-w-[140px]"
                onClick={handleSearch}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="container mx-auto max-w-7xl px-4 border-b border-gray-200">
          <div className="flex">
            <button className="px-6 py-3 font-medium text-base text-black border-b-2 border-black">METHODS</button>
          </div>
        </div>

        {/* Results Content */}
        <div className="container mx-auto max-w-7xl px-4 py-6">
          {/* Results Summary */}
          <div className="mb-6">
            <p className="text-base font-medium">
              Found {results.length} results for "{query}"
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold">
                      <Link href={result.link} className="hover:text-black hover:underline">
                        {result.title}
                      </Link>
                    </h3>
                    <button
                      onClick={() => toggleFavorite(result.id)}
                      className={`text-gray-400 hover:text-red-500 ${result.isFavorite ? "text-red-500" : ""}`}
                      aria-label={result.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart className={`h-6 w-6 ${result.isFavorite ? "fill-red-500" : ""}`} />
                    </button>
                  </div>
                  <p className="text-gray-700">{result.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
