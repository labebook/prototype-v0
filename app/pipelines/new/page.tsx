"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { NewPipelineEditor } from "@/components/new-pipeline-editor"

export default function NewPipelinePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col">
        <NewPipelineEditor />
      </div>
      <Footer />
    </div>
  )
}
