import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

export function useDeleteExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/steam/admin/expenses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.expenses.all() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.stats() })
    },
  })
}
