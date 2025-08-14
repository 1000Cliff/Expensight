import type { ExpenseRecord, DashboardData } from "@/types/expense"

export function processDashboardData(data: ExpenseRecord[], filterDepartment?: string): DashboardData {
  // Filter data by department if specified
  const filteredData = filterDepartment
    ? data.filter((record) => record.department.toLowerCase() === filterDepartment.toLowerCase())
    : data

  // Calculate chart data
  const chartData = [
    { category: "HOTEL", value: 0 },
    { category: "AIRFARE", value: 0 },
    { category: "CAR RENTAL", value: 0 },
    { category: "MEALS", value: 0 },
    { category: "EXCEPTIONS", value: 0 },
    { category: "PAST DUE", value: 0 },
  ]

  filteredData.forEach((record) => {
    const chartItem = chartData.find((item) => item.category === record.category)
    if (chartItem) {
      chartItem.value += record.amount
    }
  })

  const violationMap = new Map<
    string,
    {
      name: string
      eid: string
      violations: number
      amount: number
      department: string
      categories: Set<string>
    }
  >()

  filteredData
    .filter((record) => record.isViolation)
    .forEach((record) => {
      const key = record.employeeName
      if (violationMap.has(key)) {
        const existing = violationMap.get(key)!
        existing.violations += 1
        existing.amount += record.amount
        existing.categories.add(record.category)
      } else {
        violationMap.set(key, {
          name: record.employeeName,
          eid: `E${Math.floor(Math.random() * 9000) + 1000}`, // Generate EID
          violations: 1,
          amount: record.amount,
          department: record.department,
          categories: new Set([record.category]),
        })
      }
    })

  const violationPeople = Array.from(violationMap.values())
    .map((person) => ({
      ...person,
      categories: Array.from(person.categories),
    }))
    .sort((a, b) => b.violations - a.violations)

  const allEmployees = new Set(filteredData.map((r) => `${r.employeeName}|${r.department}`))
  const violatingEmployees = new Set(violationPeople.map((p) => `${p.name}|${p.department}`))

  const passedAuditPeople = Array.from(allEmployees)
    .filter((emp) => !violatingEmployees.has(emp))
    .map((emp) => {
      const [name, department] = emp.split("|")
      return {
        name,
        department,
        eid: `E${Math.floor(Math.random() * 9000) + 1000}`, // Generate EID
      }
    })

  const deptViolationMap = new Map<string, number>()
  if (!filterDepartment) {
    data
      .filter((record) => record.isViolation)
      .forEach((record) => {
        deptViolationMap.set(record.department, (deptViolationMap.get(record.department) || 0) + 1)
      })
  }

  const departmentRanking = Array.from(deptViolationMap.entries())
    .map(([department, violations]) => ({ department, violations }))
    .sort((a, b) => b.violations - a.violations)

  const allDepartments = ["DPTID1", "DPTID2", "DPTID3", "DPTID4", "DPTID5", "DPTID6", "DPTID7"]
  const completeDepartmentRanking = allDepartments
    .map((dept) => {
      const existing = departmentRanking.find((d) => d.department === dept)
      return existing || { department: dept, violations: 0 }
    })
    .sort((a, b) => b.violations - a.violations)

  // Calculate total stats
  const totalViolations = filteredData.filter((r) => r.isViolation).length
  const totalRecords = filteredData.length
  const complianceRate = totalRecords > 0 ? Math.round(((totalRecords - totalViolations) / totalRecords) * 100) : 0
  const avgViolation =
    violationPeople.length > 0
      ? Math.round(violationPeople.reduce((sum, p) => sum + p.amount, 0) / violationPeople.length)
      : 0

  return {
    chartData,
    violationPeople,
    passedAuditPeople,
    departmentRanking: completeDepartmentRanking,
    totalStats: {
      totalViolations,
      activeCases: violationPeople.length,
      complianceRate,
      avgViolation,
    },
  }
}

export function generateMonthlySpendingData(expenseData: ExpenseRecord[], departmentId?: string) {
  const months = [
    "Jan 2024",
    "Feb 2024",
    "Mar 2024",
    "Apr 2024",
    "May 2024",
    "Jun 2024",
    "Jul 2024",
    "Aug 2024",
    "Sep 2024",
    "Oct 2024",
    "Nov 2024",
    "Dec 2024",
  ]

  const departmentExpenses = departmentId
    ? expenseData.filter((r) => r.department.toLowerCase() === departmentId)
    : expenseData

  if (departmentExpenses.length > 0) {
    // Use actual data if available, but ensure all months are represented
    const monthlyData = new Map<string, number>()

    // Initialize all months with 0
    months.forEach((month) => monthlyData.set(month, 0))

    departmentExpenses.forEach((expense) => {
      const date = new Date(expense.date)
      const monthName = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

      if (monthlyData.has(monthName)) {
        monthlyData.set(monthName, monthlyData.get(monthName)! + expense.amount)
      }
    })

    return months.map((month) => ({
      month: month.split(" ")[0],
      amount: monthlyData.get(month) || 0,
    }))
  } else {
    // Generate sample data for demonstration
    return months.map((month) => ({
      month: month.split(" ")[0],
      amount: Math.floor(Math.random() * 50000) + 10000,
    }))
  }
}
