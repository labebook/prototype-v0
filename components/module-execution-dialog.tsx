"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { CheckCircle } from "lucide-react"

interface ModuleStep {
  id: string
  title: string
  description?: string
}

interface ModuleExecutionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  moduleName: string
  steps: ModuleStep[]
  onComplete: (checkedSteps: string[]) => void
}

export function ModuleExecutionDialog({
  open,
  onOpenChange,
  moduleName,
  steps,
  onComplete
}: ModuleExecutionDialogProps) {
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(new Set())

  // Reset when dialog opens
  useEffect(() => {
    if (open) {
      setCheckedSteps(new Set())
    }
  }, [open])

  const handleStepToggle = (stepId: string) => {
    const newChecked = new Set(checkedSteps)
    if (newChecked.has(stepId)) {
      newChecked.delete(stepId)
    } else {
      newChecked.add(stepId)
    }
    setCheckedSteps(newChecked)
  }

  const progress = (checkedSteps.size / steps.length) * 100
  const allStepsCompleted = checkedSteps.size === steps.length

  const handleFinish = () => {
    if (allStepsCompleted) {
      onComplete(Array.from(checkedSteps))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col bg-white">
        <DialogHeader>
          <DialogTitle>Executing: {moduleName}</DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            Check off each step as you complete it during your experiment.
          </p>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">
              {checkedSteps.size} / {steps.length} steps completed
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps List */}
        <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg">
          <div className="divide-y divide-gray-200">
            {steps.map((step, index) => {
              const isChecked = checkedSteps.has(step.id)
              return (
                <div
                  key={step.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    isChecked ? 'bg-green-50' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={`step-${step.id}`}
                      checked={isChecked}
                      onCheckedChange={() => handleStepToggle(step.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={`step-${step.id}`}
                        className={`flex items-center gap-2 cursor-pointer ${
                          isChecked ? 'line-through text-gray-500' : ''
                        }`}
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="font-medium">{step.title}</span>
                        {isChecked && <CheckCircle className="h-4 w-4 text-green-600" />}
                      </label>
                      {step.description && (
                        <p className={`text-sm mt-1 ml-8 ${isChecked ? 'text-gray-400' : 'text-gray-600'}`}>
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleFinish}
            disabled={!allStepsCompleted}
            className={allStepsCompleted ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {allStepsCompleted ? 'Finish & Enter Output Data' : `Complete All Steps (${steps.length - checkedSteps.size} remaining)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
