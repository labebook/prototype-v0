"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { MessageSquare, ThumbsUp, ArrowUp, Plus } from "lucide-react"

interface Discussion {
  id: string
  title: string
  body: string
  author: { name: string; initials: string }
  category: string
  replies: number
  upvotes: number
  createdAt: string
}

const CATEGORIES = ["All", "General", "Methods", "Pipelines", "Help", "Announcements"]

const MOCK_DISCUSSIONS: Discussion[] = [
  {
    id: "1",
    title: "Best practices for RNA-seq normalization pipelines?",
    body: "I'm building a pipeline that combines DESeq2 and edgeR normalization steps. Has anyone found a reliable way to benchmark which approach works best for small sample sizes?",
    author: { name: "Alice Chen", initials: "AC" },
    category: "Methods",
    replies: 12,
    upvotes: 34,
    createdAt: "2h ago",
  },
  {
    id: "2",
    title: "New CRISPR screening method added to the library",
    body: "We just published a curated CRISPR screening workflow that integrates MAGeCK and BAGEL2. Check it out in the methods library and let us know your feedback.",
    author: { name: "David Park", initials: "DP" },
    category: "Announcements",
    replies: 5,
    upvotes: 22,
    createdAt: "5h ago",
  },
  {
    id: "3",
    title: "How to connect two incompatible output/input formats?",
    body: "I have a method that outputs a BAM file but the next step in my pipeline expects FASTQ. What's the recommended way to handle format conversion within a pipeline?",
    author: { name: "Maria Lopez", initials: "ML" },
    category: "Help",
    replies: 8,
    upvotes: 15,
    createdAt: "1d ago",
  },
  {
    id: "4",
    title: "Thoughts on reproducibility standards for shared methods",
    body: "Should we enforce container versioning for all published methods? I think it would greatly improve reproducibility across teams but it adds overhead for contributors.",
    author: { name: "James Wright", initials: "JW" },
    category: "General",
    replies: 21,
    upvotes: 47,
    createdAt: "1d ago",
  },
  {
    id: "5",
    title: "Pipeline execution fails silently on large datasets",
    body: "When running my variant-calling pipeline on WGS data with more than 50 samples, the pipeline completes but produces empty output files. No errors in the logs. Any ideas?",
    author: { name: "Sarah Kim", initials: "SK" },
    category: "Help",
    replies: 3,
    upvotes: 8,
    createdAt: "2d ago",
  },
  {
    id: "6",
    title: "Comparing single-cell clustering methods: Seurat vs Scanpy",
    body: "I've been running both tools on the same PBMC dataset and getting quite different cluster assignments. Would love to hear how others approach benchmarking these.",
    author: { name: "Tom Rivera", initials: "TR" },
    category: "Methods",
    replies: 16,
    upvotes: 39,
    createdAt: "3d ago",
  },
  {
    id: "7",
    title: "Feature request: pipeline version history and rollback",
    body: "It would be incredibly useful to have built-in version history for pipelines so we can roll back to a previous configuration. Is this on the roadmap?",
    author: { name: "Nina Patel", initials: "NP" },
    category: "Pipelines",
    replies: 9,
    upvotes: 52,
    createdAt: "4d ago",
  },
]

function categoryColor(category: string) {
  switch (category) {
    case "Methods":
      return "bg-blue-50 text-blue-700"
    case "Announcements":
      return "bg-amber-50 text-amber-700"
    case "Help":
      return "bg-green-50 text-green-700"
    case "Pipelines":
      return "bg-purple-50 text-purple-700"
    default:
      return "bg-gray-100 text-gray-600"
  }
}

export default function DiscussionsPage() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filtered =
    activeCategory === "All"
      ? MOCK_DISCUSSIONS
      : MOCK_DISCUSSIONS.filter((d) => d.category === activeCategory)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[800px] px-6 py-8">
          {/* Page header */}
          <div className="flex items-end justify-between mb-8 pb-6 border-b border-gray-200">
            <div>
              <h1 className="text-[32px] font-semibold text-gray-900">Discussions</h1>
              <p className="text-gray-500 mt-1">
                Ask questions, share ideas, and connect with the community.
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New discussion
            </Button>
          </div>

          {/* Category filters */}
          <div className="flex items-center gap-2 mb-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeCategory === cat
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Feed */}
          <div className="flex flex-col">
            {filtered.map((discussion) => (
              <article
                key={discussion.id}
                className="group flex gap-4 py-5 border-b border-gray-200 cursor-pointer hover:bg-gray-50 -mx-6 px-6 transition-colors"
              >
                {/* Upvote column */}
                <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0 w-10">
                  <button className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-medium text-gray-700">
                    {discussion.upvotes}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${categoryColor(
                        discussion.category
                      )}`}
                    >
                      {discussion.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {discussion.createdAt}
                    </span>
                  </div>

                  <h2 className="text-base font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {discussion.title}
                  </h2>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {discussion.body}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-600">
                        {discussion.author.initials}
                      </div>
                      <span>{discussion.author.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>
                        {discussion.replies} {discussion.replies === 1 ? "reply" : "replies"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>{discussion.upvotes}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {filtered.length === 0 && (
              <div className="py-24 text-center">
                <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-1">
                  No discussions yet
                </p>
                <p className="text-gray-500 mb-6">
                  Be the first to start a conversation in this category.
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New discussion
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
