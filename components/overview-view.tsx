"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Plane, Car, Hotel, UtensilsCrossed, AlertTriangle, Clock, CheckCircle } from "lucide-react"
import type { DashboardData, ExpenseRecord } from "@/types/expense"
import { EmployeeStatusTabs } from "@/components/employee-status-tabs"

interface OverviewProps {
  dashboardData: DashboardData
  expenseData: ExpenseRecord[]
}

export function OverviewView({ dashboardData, expenseData }: OverviewProps) {
  const violationCards = [
    {
      title: "HOTEL VIOLATIONS",
      amount: `$${expenseData
        .filter((r) => r.category === "HOTEL" && r.isViolation)
        .reduce((sum, r) => sum + r.amount, 0)
        .toLocaleString()}`,
      count: expenseData.filter((r) => r.category === "HOTEL" && r.isViolation).length,
      icon: Hotel,
      color: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
      iconBg: "bg-blue-100 dark:bg-blue-900",
    },
    {
      title: "AIRFARE VIOLATIONS",
      amount: `$${expenseData
        .filter((r) => r.category === "AIRFARE" && r.isViolation)
        .reduce((sum, r) => sum + r.amount, 0)
        .toLocaleString()}`,
      count: expenseData.filter((r) => r.category === "AIRFARE" && r.isViolation).length,
      icon: Plane,
      color: "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300",
      iconBg: "bg-purple-100 dark:bg-purple-900",
    },
    {
      title: "CAR RENTAL VIOLATIONS",
      amount: `$${expenseData
        .filter((r) => r.category === "CAR RENTAL" && r.isViolation)
        .reduce((sum, r) => sum + r.amount, 0)
        .toLocaleString()}`,
      count: expenseData.filter((r) => r.category === "CAR RENTAL" && r.isViolation).length,
      icon: Car,
      color: "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300",
      iconBg: "bg-green-100 dark:bg-green-900",
    },
    {
      title: "MEALS VIOLATIONS",
      amount: `$${expenseData
        .filter((r) => r.category === "MEALS" && r.isViolation)
        .reduce((sum, r) => sum + r.amount, 0)
        .toLocaleString()}`,
      count: expenseData.filter((r) => r.category === "MEALS" && r.isViolation).length,
      icon: UtensilsCrossed,
      color: "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300",
      iconBg: "bg-orange-100 dark:bg-orange-900",
    },
    {
      title: "EXCEPTIONS",
      amount: `$${expenseData
        .filter((r) => r.category === "EXCEPTIONS" && r.isViolation)
        .reduce((sum, r) => sum + r.amount, 0)
        .toLocaleString()}`,
      count: expenseData.filter((r) => r.category === "EXCEPTIONS" && r.isViolation).length,
      icon: AlertTriangle,
      color: "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300",
      iconBg: "bg-red-100 dark:bg-red-900",
    },
    {
      title: "PAST DUE",
      amount: `$${expenseData
        .filter((r) => r.category === "PAST DUE" && r.isViolation)
        .reduce((sum, r) => sum + r.amount, 0)
        .toLocaleString()}`,
      count: expenseData.filter((r) => r.category === "PAST DUE" && r.isViolation).length,
      icon: Clock,
      color: "bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300",
      iconBg: "bg-gray-100 dark:bg-gray-900",
    },
  ]

  const totalSpending = dashboardData.chartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">Overview</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {expenseData.length > 0
            ? `Travel expense analysis from uploaded data (${expenseData.length} records)`
            : "Travel expense violations and spending analysis"}
        </p>
      </div>

      {/* Data Source Info */}
      {expenseData.length > 0 && (
        <Card className="mb-4 bg-card border-border">
          <CardContent className="p-2">
            <div className="flex items-center gap-1 text-xs text-green-700 dark:text-green-400">
              <CheckCircle className="h-3 w-3" />
              <span>Data loaded from uploaded files - showing results across all departments</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Violation Cards Grid */}
      <div className="grid grid-cols-6 gap-2 sm:gap-3 mb-6 sm:mb-8 overflow-x-auto">
        {violationCards.map((card, index) => {
          const IconComponent = card.icon
          return (
            <Card
              key={index}
              className="hover:shadow-md transition-shadow min-w-[120px] sm:min-w-[140px] bg-card border-border"
            >
              <CardContent className="p-1 sm:p-2">
                <div className="flex items-center justify-between mb-1">
                  <div className={`p-0.5 rounded ${card.iconBg} flex items-center`}>
                    <IconComponent
                      className={`h-2 w-2 sm:h-3 sm:w-3 ${card.color.split(" ")[2]} ${card.color.split(" ")[3]}`}
                    />
                  </div>
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    {card.count}
                  </Badge>
                </div>
                <div className="space-y-0">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-medium text-muted-foreground leading-tight line-clamp-2 flex-1">
                      {card.title}
                    </p>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm sm:text-base font-bold text-foreground">{card.amount}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader className="pb-2 sm:pb-6">
              <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
                Total Travel Spending
              </CardTitle>
              {expenseData.length > 0 && <p className="text-xs text-muted-foreground">From uploaded Excel/CSV data</p>}
            </CardHeader>
            <CardContent className="p-2 sm:p-3 pt-0">
              <ChartContainer
                config={{
                  hotel: { label: "Hotel", color: "hsl(220, 70%, 50%)" },
                  airfare: { label: "Airfare", color: "hsl(280, 70%, 50%)" },
                  carrental: { label: "Car Rental", color: "hsl(140, 70%, 50%)" },
                  meals: { label: "Meals", color: "hsl(30, 70%, 50%)" },
                  exceptions: { label: "Exceptions", color: "hsl(0, 70%, 50%)" },
                  pastdue: { label: "Past Due", color: "hsl(210, 10%, 50%)" },
                }}
                className="h-[180px] sm:h-[200px] lg:h-[220px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardData.chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius="40%"
                      outerRadius="75%"
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {dashboardData.chartData.map((entry, index) => {
                        const colors = [
                          "hsl(220, 70%, 50%)",
                          "hsl(280, 70%, 50%)",
                          "hsl(140, 70%, 50%)",
                          "hsl(30, 70%, 50%)",
                          "hsl(0, 70%, 50%)",
                          "hsl(210, 10%, 50%)",
                        ]
                        return <Cell key={`cell-${index}`} fill={colors[index]} />
                      })}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <text
                      x="50%"
                      y="45%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-foreground text-sm sm:text-base lg:text-lg font-bold"
                    >
                      ${totalSpending >= 1000 ? `${Math.round(totalSpending / 1000)}K` : totalSpending.toLocaleString()}
                    </text>
                    <text
                      x="50%"
                      y="55%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-muted-foreground text-xs sm:text-sm"
                    >
                      Total Spending
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>

              <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
                {dashboardData.chartData.map((item, index) => {
                  const colors = [
                    "bg-blue-500",
                    "bg-purple-500",
                    "bg-green-500",
                    "bg-orange-500",
                    "bg-red-500",
                    "bg-gray-500",
                  ]
                  return (
                    <div key={index} className="flex items-center gap-2 min-w-0">
                      <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${colors[index]}`} />
                      <span className="text-muted-foreground truncate flex-1">{item.category}</span>
                      <span className="font-medium flex-shrink-0 text-foreground">${item.value.toLocaleString()}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 bg-card border-border">
            <CardHeader className="pb-2 sm:pb-6">
              <CardTitle className="text-base sm:text-lg font-semibold text-foreground">Violation Ranking</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {expenseData.length > 0
                  ? "Departments by violation count from uploaded data"
                  : "Top departments by violation count"}
              </p>
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="space-y-2">
                {dashboardData.departmentRanking.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-sm">
                      {expenseData.length > 0
                        ? "No department violations in uploaded data"
                        : "No department data available"}
                    </p>
                  </div>
                ) : (
                  dashboardData.departmentRanking.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-1 px-2 bg-accent rounded text-sm">
                      <span className="font-medium text-foreground">{item.department}</span>
                      <span className="text-muted-foreground">{item.violations} violations</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Combined Employee Status Card with Tabs */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2 sm:pb-6">
            <CardTitle className="text-base sm:text-lg font-semibold text-foreground">Employee Status</CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {expenseData.length > 0 ? "Employee audit results from uploaded data" : "Employee audit results"}
            </p>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <EmployeeStatusTabs
              violationPeople={dashboardData.violationPeople}
              passedAuditPeople={dashboardData.passedAuditPeople}
              expenseData={expenseData}
            />
          </CardContent>
        </Card>
      </div>
      {/* Summary Stats */}
      <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-foreground">
              {dashboardData.totalStats.totalViolations}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">Total Violations</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-foreground">{dashboardData.totalStats.activeCases}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Active Cases</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-foreground">
              {dashboardData.totalStats.complianceRate}%
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">Compliance Rate</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-foreground">
              ${dashboardData.totalStats.avgViolation.toLocaleString()}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">Avg Violation</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
