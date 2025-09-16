"use client"

import { useState } from "react"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import type { ExpenseRecord } from "@/types/expense"
import { processDashboardData } from "@/utils/data-processor"
import { ThemeToggle } from "@/components/theme-toggle"
import { AppSidebar } from "@/components/app-sidebar"
import { ChatBot } from "@/components/chatbot"
import { WelcomeView } from "@/components/welcome-view"
import { UploadFileView } from "@/components/upload-file-view"
import { OverviewView } from "@/components/overview-view"
import { DepartmentView } from "@/components/department-view"

export default function TravelAuditDashboard() {
  const [activeSection, setActiveSection] = useState("welcome")
  const [expenseData, setExpenseData] = useState<ExpenseRecord[]>([])

  const handleDataProcessed = (data: ExpenseRecord[]) => {
    console.log("Setting expense data:", data.length, "records")
    setExpenseData(data)
    setActiveSection("overview") // Switch to overview after processing
  }

  // Get dashboard data based on active section
  const getDashboardData = () => {
    if (activeSection === "overview") {
      return processDashboardData(expenseData)
    } else if (activeSection.startsWith("dptid")) {
      return processDashboardData(expenseData, activeSection)
    }
    return processDashboardData(expenseData)
  }

  const dashboardData = getDashboardData()

  const renderContent = () => {
    if (activeSection === "welcome") {
      return <WelcomeView setActiveSection={setActiveSection} />
    } else if (activeSection === "upload") {
      return <UploadFileView onDataProcessed={handleDataProcessed} />
    } else if (activeSection === "overview") {
      return <OverviewView dashboardData={dashboardData} expenseData={expenseData} />
    } else {
      return <DepartmentView departmentId={activeSection} dashboardData={dashboardData} expenseData={expenseData} />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <SidebarInset className="flex-1 min-w-0">
          {/* Header */}
          <header className="flex items-center justify-between p-3 sm:p-4 border-b border-border bg-background">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <SidebarTrigger />
              <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">Travel Audit Dashboard</h1>
            </div>
            <ThemeToggle />
          </header>

          {/* Main Content */}
          <main className="p-3 sm:p-4 lg:p-6 bg-background min-h-screen">{renderContent()}</main>
        </SidebarInset>
      </div>
      <ChatBot expenseData={expenseData} />
    </SidebarProvider>
  )
}
