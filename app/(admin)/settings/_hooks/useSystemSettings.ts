'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { api } from '@/lib/api'
import type { ApiResponse } from '@/types/api'
import type { RenewalDiscount, ReviewPointTiers, SystemSettings } from '@/types/domain'

// 설정은 화면(카드)이 달라 각각 단독으로 보낸다 — 한쪽만 보내도 서버가 받아준다
type UpdateSystemSettingsInput = {
  defaultDurationMinutes?: number
  reviewPointTiers?: ReviewPointTiers
  renewalDiscount?: RenewalDiscount
}

function savedMessage(input: UpdateSystemSettingsInput): string {
  if (input.renewalDiscount) return '재구매 이벤트 설정이 저장되었습니다.'
  if (input.reviewPointTiers) return '리뷰 적립 포인트가 저장되었습니다.'
  return '기본 소요시간이 저장되었습니다.'
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
    onSuccess: (_res, variables) => {
      toast.success(savedMessage(variables))
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.settings.system() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '설정 저장에 실패했습니다.')
    },
  })

  return { query, mutation }
}
