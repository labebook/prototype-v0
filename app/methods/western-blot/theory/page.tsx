"use client"

import { useState } from "react"
import { ChevronUp } from "lucide-react"

// Collapsible section component
function CollapsibleSection({ 
  title, 
  children, 
  defaultExpanded = true 
}: { 
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean 
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  
  return (
    <div className="border-t border-gray-200 py-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 w-full text-left font-semibold text-gray-900 hover:text-gray-700 transition-colors"
      >
        <ChevronUp 
          className={`h-4 w-4 transition-transform duration-200 ${
            isExpanded ? "" : "rotate-180"
          }`}
        />
        {title}
      </button>
      {isExpanded && (
        <div className="mt-4 pl-6">
          {children}
        </div>
      )}
    </div>
  )
}

// Tag component
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 border border-gray-200">
      {children}
    </span>
  )
}

export default function WesternBlotTheoryPage() {
  return (
    <>
      {/* Main Illustration */}
      <div className="mb-8">
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <img
              src="/images/western-blot-transfer.png"
              alt="Western Blot transfer process showing protein bands and transfer sandwich assembly"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* Structured Content Sections */}
      <div className="space-y-0">
        {/* Introduction */}
        <CollapsibleSection title="Introduction" defaultExpanded={true}>
          <p className="text-gray-700 leading-relaxed">
            Western blot, also known as immunoblotting, is a widely used analytical technique in biochemistry, 
            molecular biology, and immunology for detecting specific proteins in a sample. The technique combines 
            gel electrophoresis for protein separation with antibody-based detection for identification of target 
            proteins. Western blotting is essential for protein identification, quantification, and analysis of 
            protein expression levels. It is widely used in research, diagnostics, and quality control to confirm 
            the presence of specific proteins, assess protein modifications, and validate experimental results.
          </p>
        </CollapsibleSection>

        {/* Object and Application */}
        <CollapsibleSection title="Object and application" defaultExpanded={true}>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>Detection of proteins</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>Protein expression analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>Protein modification analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>Antibody validation</span>
            </li>
          </ul>
        </CollapsibleSection>

        {/* Method-specific Equipment and Materials */}
        <CollapsibleSection title="Method-specific equipment and materials" defaultExpanded={true}>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>Transblot system</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>Imaging system</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>Transfer membranes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>Transfer buffer</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>Blocking solution</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>Antibodies</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>Detection substrate</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>Transfer sandwich components</span>
            </li>
          </ul>
        </CollapsibleSection>

        {/* Tags */}
        <CollapsibleSection title="Tags" defaultExpanded={true}>
          <div className="flex flex-wrap gap-2">
            <Tag>Protein analysis</Tag>
            <Tag>Immunodetection</Tag>
            <Tag>Western blot</Tag>
            <Tag>Membrane transfer</Tag>
            <Tag>Antibody-based detection</Tag>
          </div>
        </CollapsibleSection>
      </div>
    </>
  )
}
