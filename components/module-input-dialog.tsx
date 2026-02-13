"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react"

interface ModuleInputDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  moduleName: string
  onContinue: (data: { text: string; files: File[] }) => void
  initialData?: { text: string; files: File[] }
}

export function ModuleInputDialog({
  open,
  onOpenChange,
  moduleName,
  onContinue,
  initialData
}: ModuleInputDialogProps) {
  const [inputText, setInputText] = useState(initialData?.text || "")
  const [files, setFiles] = useState<File[]>(initialData?.files || [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles([...files, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleContinue = () => {
    onContinue({ text: inputText, files })
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4 text-blue-500" />
    }
    return <FileText className="h-4 w-4 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>Input Data: {moduleName}</DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            Enter the input data for this module. This can include text notes, measurements, and files.
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Text Input */}
          <div>
            <Label htmlFor="input-text" className="text-sm font-medium">
              Input Notes
            </Label>
            <Textarea
              id="input-text"
              placeholder="Enter input data, measurements, observations, etc..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="mt-2 min-h-[200px] bg-white border-gray-300"
            />
          </div>

          {/* File Upload */}
          <div>
            <Label className="text-sm font-medium">Attachments</Label>
            <div className="mt-2">
              <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload files, images, or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, PDF, DOC, XLS, CSV up to 10MB
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                />
              </label>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {getFileIcon(file)}
                      <span className="text-sm text-gray-700 truncate">{file.name}</span>
                      <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleContinue} className="bg-blue-600 hover:bg-blue-700">
            Continue to Steps
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
