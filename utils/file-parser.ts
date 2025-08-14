import type { ExpenseRecord } from "@/types/expense"

export async function parseExcelContent(file: File): Promise<ExpenseRecord[]> {
  try {
    // Read the file as array buffer
    const arrayBuffer = await file.arrayBuffer()

    // For demonstration, we'll convert to text and try CSV parsing
    // In a real implementation, you'd use a library like xlsx
    const decoder = new TextDecoder("utf-8")
    const text = decoder.decode(arrayBuffer)

    // If it looks like CSV data, parse it
    if (text.includes(",") && text.includes("\n")) {
      return parseCSVContent(text)
    }

    // For now, throw an error for true Excel binary files
    // In production, you'd use: import * as XLSX from 'xlsx'
    throw new Error(
      "Binary Excel files require additional processing. Please save your Excel file as CSV format and upload again.",
    )
  } catch (error) {
    console.error("Error parsing Excel file:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error(
      "Unable to parse Excel file. Please save your file as CSV format or ensure it contains comma-separated values.",
    )
  }
}

export function parseCSVContent(content: string): ExpenseRecord[] {
  const lines = content.split("\n").filter((line) => line.trim())
  if (lines.length < 2) {
    throw new Error("CSV file appears to be empty or improperly formatted. Please check your file and try again.")
  }

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/"/g, ""))
  const records: ExpenseRecord[] = []

  // More flexible column detection - look for partial matches
  const findColumnIndex = (searchTerms: string[]): number => {
    for (const term of searchTerms) {
      const index = headers.findIndex((h) => h.includes(term.toLowerCase()))
      if (index !== -1) return index
    }
    return -1
  }

  // Find column indices with multiple search terms for flexibility
  const employeeNameIndex = findColumnIndex(["employee name", "name", "emp name", "employee"])
  const employeeIdIndex = findColumnIndex(["employee id", "emp id", "id", "employee number"])
  const departmentIndex = findColumnIndex(["employee department", "department", "dept"])
  const parentExpenseTypeIndex = findColumnIndex(["parent expense type", "parent type", "expense category"])
  const expenseTypeIndex = findColumnIndex(["expense type", "type", "category", "sub type"])
  const amountIndex = findColumnIndex(["amount", "cost", "total", "expense amount", "dollar"])
  const violationIndex = findColumnIndex(["violation", "flag", "error", "issue"])
  const dateIndex = findColumnIndex(["date", "expense date", "transaction date"])

  // Check for required columns with better error messages
  if (employeeNameIndex === -1) {
    throw new Error(
      `Required column missing: Could not find Employee Name column. Found headers: ${headers.join(", ")}`,
    )
  }
  if (employeeIdIndex === -1) {
    throw new Error(`Required column missing: Could not find Employee ID column. Found headers: ${headers.join(", ")}`)
  }
  if (departmentIndex === -1) {
    throw new Error(
      `Required column missing: Could not find Employee Department column. Found headers: ${headers.join(", ")}`,
    )
  }
  if (parentExpenseTypeIndex === -1) {
    throw new Error(
      `Required column missing: Could not find Parent Expense Type column. Found headers: ${headers.join(", ")}`,
    )
  }
  if (expenseTypeIndex === -1) {
    throw new Error(`Required column missing: Could not find Expense Type column. Found headers: ${headers.join(", ")}`)
  }

  // Function to map Parent Expense Type to our categories
  const mapExpenseTypeToCategory = (
    expenseType: string,
  ): "HOTEL" | "AIRFARE" | "CAR RENTAL" | "MEALS" | "EXCEPTIONS" | "PAST DUE" => {
    const type = expenseType.toLowerCase().trim()

    // Hotel and hospitality mapping
    if (
      type.includes("hotel") ||
      type.includes("hospitality") ||
      type.includes("lodging") ||
      type.includes("accommodation") ||
      type.includes("motel") ||
      type.includes("resort")
    ) {
      return "HOTEL"
    }

    // Car rental mapping
    if (
      type.includes("car") ||
      type.includes("rental") ||
      type.includes("vehicle") ||
      type.includes("auto") ||
      (type.includes("transportation") && type.includes("ground"))
    ) {
      return "CAR RENTAL"
    }

    // Airfare mapping
    if (
      type.includes("airfare") ||
      type.includes("air") ||
      type.includes("flight") ||
      type.includes("airline") ||
      type.includes("aviation") ||
      (type.includes("travel") && type.includes("air"))
    ) {
      return "AIRFARE"
    }

    // Meals mapping
    if (
      type.includes("meal") ||
      type.includes("food") ||
      type.includes("dining") ||
      type.includes("restaurant") ||
      type.includes("breakfast") ||
      type.includes("lunch") ||
      type.includes("dinner") ||
      type.includes("catering") ||
      type.includes("refreshment")
    ) {
      return "MEALS"
    }

    // Exception cases
    if (
      type.includes("exception") ||
      type.includes("misc") ||
      type.includes("other") ||
      type.includes("personal") ||
      type.includes("non-reimbursable")
    ) {
      return "EXCEPTIONS"
    }

    // Past due cases
    if (
      type.includes("past") ||
      type.includes("due") ||
      type.includes("overdue") ||
      type.includes("late") ||
      type.includes("outstanding")
    ) {
      return "PAST DUE"
    }

    // Default to EXCEPTIONS for unrecognized types
    return "EXCEPTIONS"
  }

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))

    if (values.length >= 5) {
      const employeeName = values[employeeNameIndex]
      const employeeId = values[employeeIdIndex]
      const department = values[departmentIndex]
      const parentExpenseTypeValue = values[parentExpenseTypeIndex]
      const expenseTypeValue = values[expenseTypeIndex]
      const amountValue = amountIndex !== -1 ? values[amountIndex] : "0"
      const violationValue = violationIndex !== -1 ? values[violationIndex] || "" : ""

      if (!employeeName || !employeeId || !department || !parentExpenseTypeValue || !expenseTypeValue) {
        continue // Skip incomplete rows
      }

      const finalDepartment = department.toUpperCase().trim()

      // Map department names to DPTID format with better logic
      let mappedDepartment = finalDepartment

      // If department doesn't already start with DPTID, map it
      if (!finalDepartment.startsWith("DPTID")) {
        // Enhanced department mapping with more comprehensive coverage
        const departmentMap: Record<string, string> = {
          // Engineering and Technical
          ENGINEERING: "DPTID1",
          "COMPUTER SCIENCE": "DPTID1",
          "SOFTWARE ENGINEERING": "DPTID1",
          IT: "DPTID1",
          "INFORMATION TECHNOLOGY": "DPTID1",
          TECHNOLOGY: "DPTID1",

          // Finance and Accounting
          FINANCE: "DPTID2",
          ACCOUNTING: "DPTID2",
          "FINANCIAL SERVICES": "DPTID2",
          TREASURY: "DPTID2",
          AUDIT: "DPTID2",

          // Marketing and Sales
          MARKETING: "DPTID3",
          SALES: "DPTID3",
          "BUSINESS DEVELOPMENT": "DPTID3",
          "CUSTOMER SUCCESS": "DPTID3",
          ADVERTISING: "DPTID3",

          // Operations and Manufacturing
          OPERATIONS: "DPTID4",
          MANUFACTURING: "DPTID4",
          PRODUCTION: "DPTID4",
          "SUPPLY CHAIN": "DPTID4",
          LOGISTICS: "DPTID4",

          // Human Resources and Admin
          HR: "DPTID5",
          "HUMAN RESOURCES": "DPTID5",
          ADMINISTRATION: "DPTID5",
          ADMIN: "DPTID5",
          "PEOPLE OPERATIONS": "DPTID5",

          // Research and Development
          "RESEARCH AND DEVELOPMENT": "DPTID6",
          "R&D": "DPTID6",
          RESEARCH: "DPTID6",
          DEVELOPMENT: "DPTID6",
          INNOVATION: "DPTID6",

          // Legal and Compliance
          LEGAL: "DPTID7",
          COMPLIANCE: "DPTID7",
          "RISK MANAGEMENT": "DPTID7",
          GOVERNANCE: "DPTID7",
          "REGULATORY AFFAIRS": "DPTID7",
        }

        // Check for exact match first
        const exactMatch = departmentMap[finalDepartment]
        if (exactMatch) {
          mappedDepartment = exactMatch
        } else {
          // Check for partial matches
          let partialMatch = null
          for (const [key, value] of Object.entries(departmentMap)) {
            if (finalDepartment.includes(key) || key.includes(finalDepartment)) {
              partialMatch = value
              break
            }
          }

          if (partialMatch) {
            mappedDepartment = partialMatch
          } else {
            // Use consistent hash-based assignment for unknown departments
            const availableDepts = ["DPTID1", "DPTID2", "DPTID3", "DPTID4", "DPTID5", "DPTID6", "DPTID7"]
            let hash = 0
            for (let i = 0; i < finalDepartment.length; i++) {
              const char = finalDepartment.charCodeAt(i)
              hash = (hash << 5) - hash + char
              hash = hash & hash // Convert to 32-bit integer
            }
            mappedDepartment = availableDepts[Math.abs(hash) % availableDepts.length]
          }
        }
      }

      // Map the parent expense type to our category (use parent expense type for mapping)
      const category = mapExpenseTypeToCategory(parentExpenseTypeValue)

      const amount = amountIndex !== -1 ? Number.parseFloat(amountValue.replace(/[$,]/g, "")) : 0
      if (amountIndex !== -1 && isNaN(amount)) {
        continue // Skip rows with invalid amounts
      }

      const isViolation =
        violationValue.toLowerCase().includes("yes") ||
        violationValue.toLowerCase().includes("true") ||
        violationValue === "1" ||
        violationValue.toLowerCase().includes("violation")

      records.push({
        id: `${i}-${category}`,
        employeeName,
        department: mappedDepartment,
        category,
        amount,
        isViolation,
        date: dateIndex !== -1 && values[dateIndex] ? values[dateIndex] : new Date().toISOString().split("T")[0],
        description: `${parentExpenseTypeValue} - ${expenseTypeValue} expense for ${employeeName} (${finalDepartment})`,
      })
    }
  }

  if (records.length === 0) {
    throw new Error("No valid records found in the file. Please check the data format and try again.")
  }

  return records
}

export async function uploadFileToServer(file: File): Promise<void> {
  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload file to server")
    }

    console.log(`File ${file.name} uploaded successfully`)
  } catch (error) {
    console.error("Error uploading file:", error)
    // Don't throw here, just log - we still want to process the file locally
  }
}
