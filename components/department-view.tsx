"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"
import { Plane, Car, Hotel, UtensilsCrossed, AlertTriangle, Clock } from "lucide-react"
import type { DashboardData, ExpenseRecord } from "@/types/expense"
import { EmployeeStatusTabs } from "@/components/employee-status-tabs"
import { generateMonthlySpendingData } from "@/utils/data-processor"

interface DepartmentViewProps {
  departmentId: string
  dashboardData: DashboardData
  expenseData: ExpenseRecord[]
}

export function DepartmentView({ departmentId, dashboardData, expenseData }: DepartmentViewProps) {
  // Filter data for specific department
  const deptData = {
    ...dashboardData,
    violationPeople: dashboardData.violationPeople.filter((p) => p.department.toLowerCase() === departmentId),
    passedAuditPeople: dashboardData.passedAuditPeople.filter((p) => p.department.toLowerCase() === departmentId),
  }

  const monthlySpendingData = generateMonthlySpendingData(expenseData, departmentId)

  const violationCards = [
    {
      title: "HOTEL VIOLATIONS",
      amount: `$${expenseData
        .filter((r) => r.department.toLowerCase() === departmentId && r.category === "HOTEL" && r.isViolation)
        .reduce((sum, r) => sum + r.amount, 0)
        .toLocaleString()}`,
      count: expenseData.filter(
        (r) => r.department.toLowerCase() === departmentId && r.category === "HOTEL" && r.isViolation,
      ).length,
      icon: Hotel,
      color: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
      iconBg: "bg-blue-100 dark:bg-blue-900",
    },
    {
      title: "AIRFARE VIOLATIONS",
      amount: `$${expenseData
        .filter((r) => r.department.toLowerCase() === departmentId && r.category === "AIRFARE" && r.isViolation)
        .reduce((sum, r) => sum + r.amount, 0)
        .toLocaleString()}`,
      count: expenseData.filter(
        (r) => r.department.toLowerCase() === departmentId && r.category === "AIRFARE" && r.isViolation,
      ).length,
      icon: Plane,
      color: "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300",
      iconBg: "bg-purple-100 dark:bg-purple-900",
    },
    {
      title: "CAR RENTAL VIOLATIONS",
      amount: `$${expenseData
        .filter((r) => r.department.toLowerCase() === departmentId && r.category === "CAR RENTAL" && r.isViolation)
        .reduce((sum, r) => sum + r.amount, 0)
        .toLocaleString()}`,
      count: expenseData.filter(
        (r) => r.department.toLowerCase() === departmentId && r.category === "CAR RENTAL" && r.isViolation,
      ).length,
      icon: Car,
      color: "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300",
      iconBg: "bg-green-100 dark:bg-green-900",
    },
    {
      title: "MEALS VIOLATIONS",
      amount: `$${expenseData
        .filter((r) => r.department.toLowerCase() === departmentId && r.category === "MEALS" && r.isViolation)
        .reduce((sum, r) => sum + r.amount, 0)
        .toLocaleString()}`,
      count: expenseData.filter(
        (r) => r.department.toLowerCase() === departmentId && r.category === "MEALS" && r.isViolation,
      ).length,
      icon: UtensilsCrossed,
      color: "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300",
      iconBg: "bg-orange-100 dark:bg-orange-900",
    },
    {
      title: "EXCEPTIONS",
      amount: `$${expenseData
        .filter((r) => r.department.toLowerCase() === departmentId && r.category === "EXCEPTIONS" && r.isViolation)
        .reduce((sum, r) => sum + r.amount, 0)
        .toLocaleString()}`,
      count: expenseData.filter(
        (r) => r.department.toLowerCase() === departmentId && r.category === "EXCEPTIONS" && r.isViolation,
      ).length,
      icon: AlertTriangle,
      color: "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300",
      iconBg: "bg-red-100 dark:bg-red-900",
    },
    {
      title: "PAST DUE",
      amount: `$${expenseData
        .filter((r) => r.department.toLowerCase() === departmentId && r.category === "PAST DUE" && r.isViolation)
        .reduce((sum, r) => sum + r.amount, 0)
        .toLocaleString()}`,
      count: expenseData.filter(
        (r) => r.department.toLowerCase() === departmentId && r.category === "PAST DUE" && r.isViolation,
      ).length,
      icon: Clock,
      color: "bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300",
      iconBg: "bg-gray-100 dark:bg-gray-900",
    },
  ]

  const totalSpending = deptData.chartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">
          {departmentId.toUpperCase()} Dashboard
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Department-specific data from uploaded Excel/CSV files
        </p>
      </div>

      {/* Department Data Summary */}
      <Card className="mb-6 bg-card border-border">
        <CardContent className="p-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
            <div className="py-1">
              <div className="text-sm font-bold text-foreground">{deptData.violationPeople.length}</div>
              <div className="text-xs text-muted-foreground leading-tight">Employees with Violations</div>
            </div>
            <div className="py-1">
              <div className="text-sm font-bold text-foreground">{deptData.passedAuditPeople.length}</div>
              <div className="text-xs text-muted-foreground leading-tight">Clean Records</div>
            </div>
            <div className="py-1">
              <div className="text-sm font-bold text-foreground">${Math.round(totalSpending).toLocaleString()}</div>
              <div className="text-xs text-muted-foreground leading-tight">Total Spending</div>
            </div>
            <div className="py-1">
              <div className="text-sm font-bold text-foreground">
                {deptData.violationPeople.length + deptData.passedAuditPeople.length}
              </div>
              <div className="text-xs text-muted-foreground leading-tight">Total Employees</div>
            </div>
          </div>
        </CardContent>
      </Card>

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="lg:col-span-1 bg-card border-border">
            <CardHeader className="pb-2 sm:pb-6">
              <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
                {departmentId.toUpperCase()} Travel Spending
              </CardTitle>
              <p className="text-xs text-muted-foreground">Data from uploaded file</p>
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
                      data={deptData.chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius="40%"
                      outerRadius="75%"
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {deptData.chartData.map((entry, index) => {
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
                {deptData.chartData.map((item, index) => {
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

          <div className="lg:col-span-2 space-y-4">
            {/* Department Ranking - Show Position Only */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-1">
                <CardTitle className="text-xs font-semibold text-foreground">Department Ranking</CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="text-center py-1">
                  {(() => {
                    // Calculate this department's ranking position
                    const allDeptRanking = dashboardData.departmentRanking
                    const currentDeptIndex = allDeptRanking.findIndex(
                      (dept) => dept.department.toLowerCase() === departmentId,
                    )
                    const position = currentDeptIndex + 1

                    const getOrdinalSuffix = (num: number) => {
                      if (num >= 11 && num <= 13) return "th"
                      switch (num % 10) {
                        case 1:
                          return "st"
                        case 2:
                          return "nd"
                        case 3:
                          return "rd"
                        default:
                          return "th"
                      }
                    }

                    return (
                      <span className="text-sm font-bold text-foreground">
                        {position}
                        {getOrdinalSuffix(position)}
                      </span>
                    )
                  })()}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Spending Chart - Maximized */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-semibold text-foreground">Monthly Travel Spending</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {expenseData.length > 0
                    ? "Monthly spending trends from uploaded data"
                    : "Sample monthly spending data"}
                </p>
              </CardHeader>
              <CardContent className="p-1 pt-0">
                <ChartContainer
                  config={{
                    amount: { label: "Amount", color: "hsl(220, 70%, 50%)" },
                  }}
                  className="h-[240px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlySpendingData} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        dataKey="month"
                        className="text-xs fill-muted-foreground"
                        tick={{ fontSize: 10 }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis
                        className="text-xs fill-muted-foreground"
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, "Amount"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="hsl(220, 70%, 50%)"
                        strokeWidth={2}
                        dot={{ fill: "hsl(220, 70%, 50%)", strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5, stroke: "hsl(220, 70%, 50%)", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Combined Employee Status Card with Tabs for Department */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2 sm:pb-6">
            <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
              {departmentId.toUpperCase()} Employee Status
            </CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground">Department employee audit results</p>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <EmployeeStatusTabs
              violationPeople={deptData.violationPeople}
              passedAuditPeople={deptData.passedAuditPeople}
              expenseData={expenseData.filter((r) => r.department.toLowerCase() === departmentId)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
