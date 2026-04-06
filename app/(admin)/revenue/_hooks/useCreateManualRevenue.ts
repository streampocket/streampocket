import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ManualRevenue } from '@/types/domain'
import type { ApiResponse } from '@/types/api'
import type { ManualRevenueFormData } from '../_types'

export function useCreateManualRevenue() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ManualRevenueFormData) =>
      api.post<ApiResponse<ManualRevenue>>('/steam/admin/manual-revenues', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.manualRevenues.all() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.expenses.all() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.stats() })
    },
  })
}
