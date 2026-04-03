import type { ExpenseCategory } from '@/types/domain'

export type ExpenseListParams = {
  category?: ExpenseCategory
  yearMonth?: string
  dateOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export type ExpenseFormData = {
  date: string
  category: ExpenseCategory
  amount: number
  memo?: string
}

export type ExpenseSummaryParams = {
  yearMonth?: string
}
