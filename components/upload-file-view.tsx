"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, CheckCircle, Loader2 } from "lucide-react"
import type { ExpenseRecord } from "@/types/expense"
import { parseExcelContent, parseCSVContent, uploadFileToServer } from "@/utils/file-parser"

interface UploadFileViewProps {
  onDataProcessed: (data: ExpenseRecord[]) => void
}

export function UploadFileView({ onDataProcessed }: UploadFileViewProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)
      setUploadedFiles((prev) => [...prev, ...files])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setUploadedFiles((prev) => [...prev, ...files])
    }
  }

  const processFiles = async () => {
    setIsProcessing(true)

    try {
      if (uploadedFiles.length === 0) {
        throw new Error("No files uploaded. Please select CSV or Excel files to process.")
      }

      let allRecords: ExpenseRecord[] = []

      // Process actual uploaded files
      for (const file of uploadedFiles) {
        console.log(`Processing file: ${file.name}`)

        // Upload file to server
        await uploadFileToServer(file)

        if (file.name.endsWith(".csv") || file.type === "text/csv") {
          const content = await file.text()
          const records = parseCSVContent(content)
          allRecords = [...allRecords, ...records]
        } else if (
          file.name.endsWith(".xlsx") ||
          file.name.endsWith(".xls") ||
          file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.type === "application/vnd.ms-excel"
        ) {
          const records = await parseExcelContent(file)
          allRecords = [...allRecords, ...records]
        } else {
          // Try to parse as CSV for other file types
          try {
            const content = await file.text()
            const records = parseCSVContent(content)
            allRecords = [...allRecords, ...records]
          } catch (error) {
            throw new Error(`Unsupported file type: ${file.name}. Please upload CSV or Excel files.`)
          }
        }
      }

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log(`Processed ${allRecords.length} records`)

      const departmentGroups = allRecords.reduce(
        (acc, record) => {
          if (!acc[record.department]) {
            acc[record.department] = []
          }
          acc[record.department].push(record)
          return acc
        },
        {} as Record<string, ExpenseRecord[]>,
      )

      onDataProcessed(allRecords)

      const deptCounts = Object.entries(departmentGroups)
        .map(([dept, records]) => {
          const originalDepts = [
            ...new Set(
              records
                .map((r) => {
                  const match = r.description?.match(/\$\$([^)]+)\$\$/)
                  return match ? match[1] : null
                })
                .filter(Boolean),
            ),
          ]
          const uniqueOriginals = originalDepts.length > 0 ? originalDepts : ["Unknown"]
          return `${dept}: ${records.length} records (from: ${uniqueOriginals.join(", ")})`
        })
        .join("\n")

      alert(`Successfully processed ${allRecords.length} expense records!

Department Mapping (CSV → DPTID):
${deptCounts}

Note: Data is now organized by DPTID in the sidebar menu.`)
    } catch (error: any) {
      console.error("Error processing files:", error)
      alert(error.message || "Error processing files. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">Upload Travel Expense Files</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">Upload CSV, Excel, or PDF files for audit processing</p>
      </div>

      {/* Main Upload Card */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-green-700 flex items-center gap-2">
            <Upload className="h-5 w-5" />
            File Upload Center
          </CardTitle>
          <p className="text-sm text-muted-foreground">Drag and drop files or click to browse</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Area */}
            <div className="lg:col-span-2">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors relative ${
                  dragActive
                    ? "border-green-500 bg-green-50 dark:bg-green-950"
                    : "border-border hover:border-green-400 hover:bg-accent"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-foreground">Drop files here or click to upload</p>
                  <p className="text-sm text-muted-foreground">Supports CSV, XLSX, XLS files up to 10MB</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept=".csv,.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white">Choose Files</Button>
              </div>
            </div>

            {/* Upload Status */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Upload Status</h3>
              {uploadedFiles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto h-8 w-8 mb-2" />
                  <p className="text-sm">No files uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950 rounded border border-green-200 dark:border-green-800"
                    >
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-foreground truncate flex-1">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
              {uploadedFiles.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 bg-transparent"
                  onClick={() => setUploadedFiles([])}
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Processing Options */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex flex-wrap gap-3">
              <Button
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white"
                onClick={processFiles}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Files...
                  </>
                ) : (
                  "Process Files"
                )}
              </Button>
            </div>
            {uploadedFiles.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">Please select CSV or Excel files to process.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expected File Format */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">Expected File Format</CardTitle>
          <p className="text-sm text-muted-foreground">Your Excel/CSV file should contain these columns:</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-foreground">Required Columns:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  • <strong>Employee Name</strong> - Full name of employee
                </li>
                <li>
                  • <strong>Employee ID</strong> - Unique employee identifier
                </li>
                <li>
                  • <strong>Employee Department</strong> - Department identifier
                </li>
                <li>
                  • <strong>Parent Expense Type</strong> - Main category (hotel, car, airfare, meals, etc.)
                </li>
                <li>
                  • <strong>Expense Type</strong> - Specific expense subcategory
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
