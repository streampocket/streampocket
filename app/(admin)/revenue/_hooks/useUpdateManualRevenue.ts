import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ManualRevenue } from '@/types/domain'
import type { ApiResponse } from '@/types/api'
import type { ManualRevenueFormData } from '../_types'

type UpdateManualRevenueInput = {
  id: string
  data: Partial<ManualRevenueFormData>
}

export function useUpdateManualRevenue() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdateManualRevenueInput) =>
      api.put<ApiResponse<ManualRevenue>>(`/steam/admin/manual-revenues/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.manualRevenues.all() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.expenses.all() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.stats() })
    },
  })
}
