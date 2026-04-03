import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { Expense } from '@/types/domain'
import type { ApiResponse } from '@/types/api'
import type { ExpenseFormData } from '../_types'

type UpdateExpenseInput = {
  id: string
  data: Partial<ExpenseFormData>
}

export function useUpdateExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdateExpenseInput) =>
      api.put<ApiResponse<Expense>>(`/steam/admin/expenses/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.expenses.all() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.stats() })
    },
  })
}
