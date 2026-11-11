/** 직원(알바) 관리자 계정 — GET /admin/staff */
export type StaffAccount = {
  id: string
  email: string
  permissions: string[]
  isActive: boolean
  createdAt: string
}
