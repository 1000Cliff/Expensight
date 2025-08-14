"use client"

import { useState } from "react"
import type { ViolationPerson, ExpenseRecord } from "@/types/expense"

interface EmployeeStatusTabsProps {
  violationPeople: ViolationPerson[]
  passedAuditPeople: Array<{ name: string; department: string; eid: string }>
  expenseData: ExpenseRecord[]
}

export function EmployeeStatusTabs({ violationPeople, passedAuditPeople, expenseData }: EmployeeStatusTabsProps) {
  const [activeTab, setActiveTab] = useState<"violations" | "passed" | "pending">("violations")

  // Generate pending people (those with comments/descriptions containing certain keywords)
  const pendingPeople = expenseData
    .filter(
      (record) =>
        record.description &&
        (record.description.toLowerCase().includes("pending") ||
          record.description.toLowerCase().includes("review") ||
          record.description.toLowerCase().includes("comment") ||
          record.description.toLowerCase().includes("note")),
    )
    .reduce(
      (acc, record) => {
        const existing = acc.find((p) => p.name === record.employeeName)
        if (existing) {
          existing.items += 1
        } else {
          acc.push({
            name: record.employeeName,
            department: record.department,
            eid: `E${Math.floor(Math.random() * 9000) + 1000}`,
            items: 1,
            reason: "Pending Review",
          })
        }
        return acc
      },
      [] as Array<{ name: string; department: string; eid: string; items: number; reason: string }>,
    )

  const tabs = [
    { id: "violations", label: "Violations", count: violationPeople.length, color: "text-red-600" },
    { id: "passed", label: "Passed", count: passedAuditPeople.length, color: "text-green-600" },
    { id: "pending", label: "Pending", count: pendingPeople.length, color: "text-yellow-600" },
  ]

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {activeTab === "violations" && (
          <>
            {violationPeople.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">
                  {expenseData.length > 0 ? "No violations found in uploaded data" : "No violations found"}
                </p>
              </div>
            ) : (
              violationPeople.map((person, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-2 sm:p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-100 dark:border-red-800"
                >
                  <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 bg-red-200 dark:bg-red-800 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-red-700 dark:text-red-300">
                        {person.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground text-sm truncate">{person.name}</p>
                      <p className="text-xs text-muted-foreground">
                        EID: {person.eid} • {person.department}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400">{person.violations} violations</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {person.categories.map((category, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-1 rounded"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-red-700 dark:text-red-400 font-medium flex-shrink-0">
                    ${person.amount.toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === "passed" && (
          <>
            {passedAuditPeople.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">
                  {expenseData.length > 0 ? "No clean records in uploaded data" : "No clean records found"}
                </p>
              </div>
            ) : (
              passedAuditPeople.map((person, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 sm:p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-100 dark:border-green-800"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-300">
                        {person.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground text-sm sm:text-base truncate">{person.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">EID: {person.eid}</p>
                      <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">{person.department}</p>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm text-green-700 dark:text-green-400 font-medium flex-shrink-0">
                    ✓
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === "pending" && (
          <>
            {pendingPeople.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No pending reviews found</p>
              </div>
            ) : (
              pendingPeople.map((person, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 sm:p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-100 dark:border-yellow-800"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-200 dark:bg-yellow-800 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs sm:text-sm font-medium text-yellow-700 dark:text-yellow-300">
                        {person.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground text-sm sm:text-base truncate">{person.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">EID: {person.eid}</p>
                      <p className="text-xs sm:text-sm text-yellow-600 dark:text-yellow-400">
                        {person.department} • {person.items} item{person.items !== 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">{person.reason}</p>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-400 font-medium flex-shrink-0">
                    ⏳
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  )
}
