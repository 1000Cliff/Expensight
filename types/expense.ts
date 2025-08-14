export interface ExpenseRecord {
  id: string
  employeeName: string
  department: string
  category: "HOTEL" | "AIRFARE" | "CAR RENTAL" | "MEALS" | "EXCEPTIONS" | "PAST DUE"
  amount: number
  isViolation: boolean
  date: string
  description?: string
}

export interface ViolationPerson {
  name: string
  eid: string
  violations: number
  amount: number
  department: string
  categories: string[]
}

export interface DashboardData {
  chartData: Array<{ category: string; value: number }>
  violationPeople: ViolationPerson[]
  passedAuditPeople: Array<{ name: string; department: string; eid: string }>
  departmentRanking: Array<{ department: string; violations: number }>
  totalStats: {
    totalViolations: number
    activeCases: number
    complianceRate: number
    avgViolation: number
  }
}
