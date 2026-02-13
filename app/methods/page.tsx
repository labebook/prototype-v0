"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

// Sample methods data
const sampleMethods = [
  {
    id: "M001",
    name: "SDS-PAGE",
    description: "Sodium dodecyl sulfate–polyacrylamide gel electrophoresis",
    status: "favorite",
    lastModified: "2025-03-22",
    link: "/methods/sds-page/theory",
  },
  {
    id: "M002",
    name: "Western Blot",
    description: "Protein detection technique using antibodies",
    status: "saved",
    lastModified: "2025-03-18",
    link: "#",
  },
  {
    id: "M003",
    name: "PCR",
    description: "Polymerase chain reaction for DNA amplification",
    status: "working",
    lastModified: "2025-03-15",
    link: "#",
  },
  {
    id: "M004",
    name: "ELISA",
    description: "Enzyme-linked immunosorbent assay",
    status: "saved",
    lastModified: "2025-03-10",
    link: "#",
  },
  {
    id: "M005",
    name: "Mass Spectrometry",
    description: "Analytical technique to measure mass-to-charge ratio of ions",
    status: null,
    lastModified: "2025-02-28",
    link: "#",
  },
]

export default function MethodsPage() {
  const [methods, setMethods] = useState(sampleMethods)

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
                <h1 className="text-3xl font-semibold mb-2">Methods</h1>
                <p className="text-base text-gray-600">Browse and manage your collection of scientific methods</p>
              </div>
              <div>
                <Button className="h-12 bg-black hover:bg-gray-800">
                  <Plus className="mr-2 h-4 w-4" /> New Method
                </Button>
              </div>
            </div>

            {/* Methods List */}
            {methods.length > 0 ? (
              <div className="space-y-6 max-w-[800px] mx-auto">
                {methods.map((method) => (
                  <div
                    key={method.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Link href={method.link} className="hover:text-black hover:underline">
                            {method.name}
                          </Link>
                        </h3>
                        <p className="text-gray-700 mt-1">{method.description}</p>
                      </div>
                      <Button variant="outline" size="sm" className="h-8">
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
                          className="mr-1 h-3 w-3"
                        >
                          <circle cx="18" cy="5" r="3" />
                          <circle cx="6" cy="12" r="3" />
                          <circle cx="18" cy="19" r="3" />
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                        Share
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gray-100 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
                  <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">No methods found</h3>
                <p className="text-gray-500 mb-6">Get started by creating your first method</p>
                <Button className="h-12 bg-black hover:bg-gray-800">
                  <Plus className="mr-2 h-4 w-4" /> New Method
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
