'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { api } from '@/lib/api'
import type { ApiResponse } from '@/types/api'
import type { SystemSettings } from '@/types/domain'

type UpdateSystemSettingsInput = {
  defaultDurationMinutes: number
}

export function useSystemSettings() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: QUERY_KEYS.settings.system(),
    queryFn: () => api.get<ApiResponse<SystemSettings>>('/steam/admin/settings'),
    select: (response) => response.data,
  })

  const mutation = useMutation({
    mutationFn: (data: UpdateSystemSettingsInput) =>
      api.patch<ApiResponse<SystemSettings>>('/steam/admin/settings', data),
    onSuccess: () => {
      toast.success('기본 소요시간이 저장되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.settings.system() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '설정 저장에 실패했습니다.')
    },
  })

  return { query, mutation }
}
