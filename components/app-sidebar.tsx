"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Upload } from "lucide-react"
import Image from "next/image"

interface AppSidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export function AppSidebar({ activeSection, setActiveSection }: AppSidebarProps) {
  const departments = ["DPTID1", "DPTID2", "DPTID3", "DPTID4", "DPTID5", "DPTID6", "DPTID7"]

  return (
    <Sidebar className="border-r border-border bg-background" collapsible="icon">
      <SidebarHeader className="p-2 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-12 h-8 flex items-center justify-center flex-shrink-0 group-data-[collapsible=icon]:hidden">
            <Image
              src="/images/cal-poly-logo.png"
              alt="Cal Poly San Luis Obispo"
              width={48}
              height={32}
              className="max-w-full max-h-full object-contain"
              priority
            />
          </div>
          <div className="text-xs min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="font-semibold text-green-700 truncate leading-tight">CAL POLY</div>
            <div className="text-green-600 text-xs truncate leading-tight">SAN LUIS OBISPO</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <SidebarMenu className="p-2">
          {/* Welcome Menu Item */}
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={activeSection === "welcome"}
              className="w-full justify-start hover:bg-accent hover:text-accent-foreground"
              onClick={() => setActiveSection("welcome")}
            >
              <div className="w-4 h-4 bg-blue-600 rounded-sm flex-shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">Welcome</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Upload File Menu Item */}
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={activeSection === "upload"}
              className="w-full justify-start hover:bg-accent hover:text-accent-foreground"
              onClick={() => setActiveSection("upload")}
            >
              <Upload className="w-4 h-4 flex-shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">Upload File</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Overview Menu Item */}
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={activeSection === "overview"}
              className="w-full justify-start hover:bg-accent hover:text-accent-foreground"
              onClick={() => setActiveSection("overview")}
            >
              <div className="w-4 h-4 bg-green-600 rounded-sm flex-shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">Overview</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="px-2 py-4 group-data-[collapsible=icon]:px-2">
          <div className="text-xs font-medium text-muted-foreground mb-2 px-2 group-data-[collapsible=icon]:hidden">
            DEPARTMENTS
          </div>
          <SidebarMenu>
            {departments.map((dept, index) => (
              <SidebarMenuItem key={dept}>
                <SidebarMenuButton
                  isActive={activeSection === dept.toLowerCase()}
                  className="w-full justify-start text-sm hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setActiveSection(dept.toLowerCase())}
                >
                  <div className="w-3 h-3 bg-blue-400 rounded-full flex-shrink-0" />
                  <span className="group-data-[collapsible=icon]:hidden">{dept}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
