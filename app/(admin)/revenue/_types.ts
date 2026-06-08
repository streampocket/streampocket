import type { ExpenseCategory, ExpensePayer, Store } from '@/types/domain'

export type ExpenseListParams = {
  category?: ExpenseCategory
  yearMonth?: string
  dateOrder?: 'asc' | 'desc'
  store?: Store
  page?: number
  pageSize?: number
}

export type ExpenseFormData = {
  date: string
  category: ExpenseCategory
  payer: ExpensePayer
  amount: number
  memo?: string
  steamOrderItemId?: string | null
  // 사업 귀속. null = 공통(전사). 주문연동 시 서버가 주문 store로 덮어씀.
  store?: Store | null
}

export type ExpenseSummaryParams = {
  yearMonth?: string
  store?: Store
}

export type ManualRevenueListParams = {
  yearMonth?: string
  dateOrder?: 'asc' | 'desc'
  store?: Store
  page?: number
  pageSize?: number
}

export type ManualRevenueFormData = {
  date: string
  amount: number
  memo?: string
  // 사업 귀속. null = 공통(전사).
  store?: Store | null
}
