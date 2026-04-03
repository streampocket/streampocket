import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { Expense } from '@/types/domain'
import type { ApiResponse } from '@/types/api'
import type { ExpenseFormData } from '../_types'

export function useCreateExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ExpenseFormData) =>
      api.post<ApiResponse<Expense>>('/steam/admin/expenses', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.expenses.all() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.stats() })
    },
  })
}
