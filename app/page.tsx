"use client"

import { useState } from "react"
import { Search } from "@/components/search-home"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

type Mode = "explore" | "workspace"

export default function ScientificMethodManager() {
  const [activeMode, setActiveMode] = useState<Mode>("explore")

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        activeMode === "workspace" ? "bg-blue-50/50" : "bg-white"
      }`}
    >
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <section className="text-center mb-8">
          <h1 className="text-3xl font-semibold mb-4">Scientific Method Manager</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search, organize, and build pipelines
            <br />
            with scientific methods from our comprehensive library.
          </p>
        </section>

        {/* Mode Switch Tabs */}
        <div className="flex items-center gap-2 mb-12 p-1.5 bg-gray-100 rounded-xl">
          <button
            onClick={() => setActiveMode("explore")}
            className={`px-6 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
              activeMode === "explore"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Explore Plyow Library
          </button>
          <button
            onClick={() => setActiveMode("workspace")}
            className={`px-6 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
              activeMode === "workspace"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Research Workspace
          </button>
        </div>

        {/* Mode Content */}
        {activeMode === "explore" ? (
          <section className="w-full max-w-3xl">
            <Search />
          </section>
        ) : (
          <section className="w-full max-w-3xl text-center">
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Your Private Research Workspace
              </h2>
              <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                Organize your projects, build custom pipelines, and manage your research workflows in a private environment.
              </p>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Go to My Projects
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
