"use client"

import { useState, Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronRight, Check, Beaker, FlaskConical, Package, Box, Monitor, FileText, Folder, ChevronLeft, Grid, List } from "lucide-react"

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

// Equipment subcategories with item counts
const equipmentItems = [
  { id: "gel-electrophoresis", label: "Gel Electrophoresis Equipment", count: 2 },
  { id: "basic-lab", label: "Basic Lab Equipment", count: 3 },
  { id: "micropipettes", label: "Micropipettes", count: 3 },
  { id: "microcentrifuge", label: "Benchtop Microcentrifuge", count: 3 },
  { id: "spectrophotometer", label: "UV-Vis Spectrophotometer", count: 3 },
  { id: "cooling-rack", label: "Cooling Rack PCR", count: 3 },
  { id: "laboratory-marker", label: "Laboratory Marker", count: 3 },
  { id: "vortex-mixer", label: "Vortex Mixer", count: 3 },
]

// Gel Electrophoresis Equipment subfolders
const gelElectrophoresisItems = [
  { id: "electrophoresis-cells", label: "Electrophoresis Cells", count: 4 },
  { id: "power-supplies", label: "Power Supplies", count: 3 },
]

// Product data for Electrophoresis Cells
const electrophoresisCellsProducts = [
  {
    id: "mini-protean-tetra",
    name: "Mini-PROTEAN Tetra Vertical Electrophoresis Cell",
    manufacturer: "Bio-Rad",
    articleNumber: "1658004",
    image: "/placeholder.svg?height=120&width=120",
    brandLogo: "/placeholder.svg?height=24&width=60",
  },
  {
    id: "xcell-surelock",
    name: "XCell SureLock Mini-Cell Electrophoresis System",
    manufacturer: "Thermo Fisher Scientific",
    articleNumber: "EI0001",
    image: "/placeholder.svg?height=120&width=120",
    brandLogo: "/placeholder.svg?height=24&width=60",
  },
  {
    id: "novex-bolt",
    name: "Bolt Mini Gel Tank",
    manufacturer: "Invitrogen",
    articleNumber: "A25977",
    image: "/placeholder.svg?height=120&width=120",
    brandLogo: "/placeholder.svg?height=24&width=60",
  },
  {
    id: "criterion-cell",
    name: "Criterion Vertical Electrophoresis Cell",
    manufacturer: "Bio-Rad",
    articleNumber: "1656001",
    image: "/placeholder.svg?height=120&width=120",
    brandLogo: "/placeholder.svg?height=24&width=60",
  },
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
  
  // Navigation state for drilling into folders
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

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

  // Navigate into a folder
  const navigateInto = (folderId: string) => {
    setCurrentPath([...currentPath, folderId])
  }

  // Navigate back
  const navigateBack = () => {
    setCurrentPath(currentPath.slice(0, -1))
  }

  // Get current category info
  const currentCategory = materialsCategories.find(c => c.id === selectedCategory)

  // Get breadcrumb labels
  const getBreadcrumbLabels = () => {
    const labels: string[] = [currentCategory?.label || ""]
    
    if (currentPath.includes("gel-electrophoresis")) {
      labels.push("Gel Electrophoresis Equipment")
    }
    if (currentPath.includes("electrophoresis-cells")) {
      labels.push("Electrophoresis Cells")
    }
    if (currentPath.includes("power-supplies")) {
      labels.push("Power Supplies")
    }
    
    return labels
  }

  // Determine what content to show based on current path
  const renderEquipmentContent = () => {
    // Inside Electrophoresis Cells - show products
    if (currentPath.includes("electrophoresis-cells")) {
      return (
        <div>
          {/* View toggle and breadcrumb */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <button 
                onClick={() => setCurrentPath([])}
                className="hover:text-gray-700"
              >
                Equipment
              </button>
              <ChevronRight className="h-4 w-4" />
              <button 
                onClick={() => setCurrentPath(["gel-electrophoresis"])}
                className="hover:text-gray-700"
              >
                Gel Electrophoresis Equipment
              </button>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900 font-medium">Electrophoresis Cells</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Products */}
          {viewMode === "grid" ? (
            // Grid view - Detailed cards
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {electrophoresisCellsProducts.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-lg bg-white p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-50 rounded-lg mb-4 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">{product.manufacturer}</p>
                  <p className="text-xs text-gray-500 mb-3">Article: {product.articleNumber}</p>
                  
                  {/* Brand Logo */}
                  <div className="pt-3 border-t border-gray-100">
                    <img
                      src={product.brandLogo}
                      alt={`${product.manufacturer} logo`}
                      className="h-5 object-contain opacity-60"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // List view - Compact cards
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {electrophoresisCellsProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`flex items-center px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                    index < electrophoresisCellsProducts.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.manufacturer}</p>
                    <p className="text-xs text-gray-400">Article: {product.articleNumber}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

    // Inside Gel Electrophoresis Equipment - show subfolders
    if (currentPath.includes("gel-electrophoresis")) {
      return (
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <button 
              onClick={() => setCurrentPath([])}
              className="hover:text-gray-700"
            >
              Equipment
            </button>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">Gel Electrophoresis Equipment</span>
          </div>

          <div className="border-t border-gray-200">
            {/* Header row */}
            <div className="flex items-center px-4 py-3 text-xs font-medium text-blue-600 uppercase tracking-wide">
              <span className="flex-1">Name</span>
              <span className="w-24 text-right pr-8">Items</span>
            </div>
            
            {/* Folder items */}
            {gelElectrophoresisItems.map((item) => (
              <button
                key={item.id}
                className="flex items-center w-full px-4 py-3 border-t border-gray-100 hover:bg-gray-50 transition-colors text-left group"
                onClick={() => navigateInto(item.id)}
              >
                <Folder className="h-5 w-5 text-amber-400 mr-3 flex-shrink-0" />
                <span className="flex-1 text-sm font-medium text-gray-900">
                  {item.label}
                </span>
                <span className="text-sm text-gray-500 mr-2">
                  {item.count}
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      )
    }

    // Root Equipment level - show all equipment items
    return (
      <div className="border-t border-gray-200">
        {/* Header row */}
        <div className="flex items-center px-4 py-3 text-xs font-medium text-blue-600 uppercase tracking-wide">
          <span className="flex-1">Name</span>
          <span className="w-24 text-right pr-8">Methods</span>
        </div>
        
        {/* List items */}
        {equipmentItems.map((item) => (
          <button
            key={item.id}
            className="flex items-center w-full px-4 py-3 border-t border-gray-100 hover:bg-gray-50 transition-colors text-left group"
            onClick={() => {
              if (item.id === "gel-electrophoresis") {
                navigateInto(item.id)
              }
            }}
          >
            <Folder className="h-5 w-5 text-amber-400 mr-3 flex-shrink-0" />
            <span className="flex-1 text-sm font-medium text-gray-900">
              {item.label}
            </span>
            <span className="text-sm text-gray-500 mr-2">
              {item.count}
            </span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </button>
        ))}
      </div>
    )
  }

  // Get current page title based on path
  const getCurrentTitle = () => {
    if (currentPath.includes("electrophoresis-cells")) {
      return "Electrophoresis Cells"
    }
    if (currentPath.includes("power-supplies")) {
      return "Power Supplies"
    }
    if (currentPath.includes("gel-electrophoresis")) {
      return "Gel Electrophoresis Equipment"
    }
    return currentCategory?.label || ""
  }

  const getCurrentDescription = () => {
    if (currentPath.includes("electrophoresis-cells")) {
      return "Browse electrophoresis cells and tanks for gel electrophoresis"
    }
    if (currentPath.includes("power-supplies")) {
      return "Browse power supplies for electrophoresis systems"
    }
    if (currentPath.includes("gel-electrophoresis")) {
      return "Browse gel electrophoresis equipment and accessories"
    }
    return `Browse ${currentCategory?.label.toLowerCase()} in the materials library`
  }

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
                        onClick={() => {
                          setSelectedCategory(category.id)
                          setCurrentPath([])
                        }}
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
              {/* Page header with back button */}
              <div className="flex items-end justify-between mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  {currentPath.length > 0 && (
                    <button
                      onClick={navigateBack}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </button>
                  )}
                  <div>
                    <h1 className="text-[32px] font-semibold">{getCurrentTitle()}</h1>
                    <p className="text-gray-500 mt-1">
                      {getCurrentDescription()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              {selectedCategory === "equipment" ? (
                renderEquipmentContent()
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
