"use client"

import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

export default function WesternBlotPipelinesPage() {
  return (
    <div className="space-y-8">
      {/* Pipeline Selector */}
      <div className="flex items-center gap-4">
        <label htmlFor="pipeline-select" className="text-base font-medium text-gray-900">
          Pipeline
        </label>
        <Select defaultValue="basic">
          <SelectTrigger id="pipeline-select" className="w-[280px]">
            <SelectValue placeholder="Select a pipeline" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">Basic pipeline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pipeline Steps */}
      <div className="space-y-6">
        {/* Step 1 */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                  1
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">Protein Isolation</h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    This step represents a customized module for protein extraction from a biological object.
                  </p>
                  <p className="text-base text-gray-700 leading-relaxed">Protein isolation depends on:</p>
                  <ul className="list-disc list-inside space-y-1 text-base text-gray-700 ml-4">
                    <li>the biological material,</li>
                    <li>the type and properties of target proteins,</li>
                    <li>the extraction method,</li>
                    <li>the specific research question.</li>
                  </ul>
                  <p className="text-base text-gray-700 leading-relaxed">
                    This step is highly variable and study-specific.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                  2
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">Protein Concentration Measurement</h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    After isolation, protein concentration must be measured.
                  </p>
                  <p className="text-base text-gray-700 leading-relaxed">Common methods include:</p>
                  <ul className="list-disc list-inside space-y-1 text-base text-gray-700 ml-4">
                    <li>Bradford assay,</li>
                    <li>BCA assay,</li>
                    <li>optical density at 280 nm,</li>
                    <li>and other approaches.</li>
                  </ul>
                  <p className="text-base text-gray-700 leading-relaxed">
                    This step is interchangeable; the exact method depends on experimental needs.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                  3
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">SDS-PAGE</h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    Proteins are separated by size using SDS-PAGE as a preparation step for downstream detection.
                  </p>
                  <p className="text-base text-gray-700 leading-relaxed">
                    Learn more about{" "}
                    <Link href="/methods/sds-page/theory" className="text-blue-600 hover:text-blue-700 underline">
                      SDS-PAGE method
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 4 */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                  4
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">Western Blot</h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    Final detection step based on antibody–antigen interactions.
                  </p>
                  <p className="text-base text-gray-700 leading-relaxed">
                    This is the core method represented by the current page.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
