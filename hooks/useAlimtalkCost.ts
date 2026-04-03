'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ApiResponse } from '@/types/api'

export function useAlimtalkCost() {
  return useQuery({
    queryKey: QUERY_KEYS.settings.alimtalkCost(),
    queryFn: () =>
      api.get<ApiResponse<{ cost: number }>>('/steam/admin/settings/alimtalk-cost'),
    select: (res) => res.data.cost,
  })
}

export function useUpdateAlimtalkCost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (cost: number) =>
      api.put<ApiResponse<{ cost: number }>>('/steam/admin/settings/alimtalk-cost', { cost }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'alimtalk-cost'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
    },
  })
}
