import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ApiResponse } from '@/types/api'

export function useCommissionRate() {
  return useQuery({
    queryKey: QUERY_KEYS.settings.commission(),
    queryFn: () =>
      api.get<ApiResponse<{ rate: number }>>('/steam/admin/settings/commission'),
    select: (res) => res.data.rate,
  })
}

export function useUpdateCommissionRate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (rate: number) =>
      api.put<ApiResponse<{ rate: number }>>('/steam/admin/settings/commission', { rate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'commission'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
