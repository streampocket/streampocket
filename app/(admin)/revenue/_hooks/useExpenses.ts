import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { Expense } from '@/types/domain'
import type { ExpenseListParams } from '../_types'

type ExpensesResponse = {
  data: Expense[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export function useExpenses(params: ExpenseListParams) {
  const queryParams = new URLSearchParams()
  if (params.category) queryParams.set('category', params.category)
  if (params.yearMonth) queryParams.set('yearMonth', params.yearMonth)
  if (params.dateOrder) queryParams.set('dateOrder', params.dateOrder)
  if (params.page) queryParams.set('page', String(params.page))
  if (params.pageSize) queryParams.set('pageSize', String(params.pageSize))

  return useQuery({
    queryKey: QUERY_KEYS.expenses.list(params as Record<string, unknown>),
    queryFn: () =>
      api.get<ExpensesResponse>(`/steam/admin/expenses?${queryParams.toString()}`),
  })
}
