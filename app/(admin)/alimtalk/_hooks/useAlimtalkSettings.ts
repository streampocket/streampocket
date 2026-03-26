'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { api } from '@/lib/api'
import type { ApiResponse } from '@/types/api'
import type { AlimtalkSettings, AlimtalkTestResult } from '@/types/domain'

type UpdateAlimtalkSettingsInput = {
  enabled: boolean
}

export function useAlimtalkSettings() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: QUERY_KEYS.alimtalk.settings(),
    queryFn: () => api.get<ApiResponse<AlimtalkSettings>>('/steam/admin/alimtalk'),
    select: (response) => response.data,
  })

  const mutation = useMutation({
    mutationFn: (data: UpdateAlimtalkSettingsInput) =>
      api.patch<ApiResponse<AlimtalkSettings>>('/steam/admin/alimtalk', data),
    onSuccess: () => {
      toast.success('알림톡 설정이 저장되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.alimtalk.settings() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '알림톡 설정 저장에 실패했습니다.')
    },
  })

  const testMutation = useMutation({
    mutationFn: () => api.post<ApiResponse<AlimtalkTestResult>>('/steam/admin/alimtalk/test'),
    onSuccess: (response) => {
      toast.success(
        `테스트 전송 완료: ${response.data.recipient}${response.data.providerMessageId ? ` (${response.data.providerMessageId})` : ''}`,
      )
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.alimtalk.settings() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '알림톡 테스트 전송에 실패했습니다.')
    },
  })

  return { query, mutation, testMutation }
}
