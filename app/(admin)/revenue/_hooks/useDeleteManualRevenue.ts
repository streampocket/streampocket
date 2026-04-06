import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

export function useDeleteManualRevenue() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/steam/admin/manual-revenues/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.manualRevenues.all() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.expenses.all() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.stats() })
    },
  })
}
