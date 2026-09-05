'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { api } from '@/lib/api'
import type { ApiResponse } from '@/types/api'
import type { SystemSettings } from '@/types/domain'

/**
 * 승인 모달의 자동발송 토글 — 마지막에 둔 상태를 전역(SystemSettings)에 저장한다.
 * 승인 건마다 고르게 하지 않는 이유: 운영 방식이 바뀌지 않는 한 매번 같은 값을 고르게 되기 때문.
 *
 * 시스템 설정 화면의 useSystemSettings와 같은 쿼리를 공유하되(캐시 재사용),
 * 토글 하나만 PATCH한다 — 서버가 필드별 부분 업데이트라 다른 설정은 건드리지 않는다.
 */
export function usePartyAutoDeliverSetting() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: QUERY_KEYS.settings.system(),
    queryFn: () => api.get<ApiResponse<SystemSettings>>('/steam/admin/settings'),
    select: (response) => response.data.partyAutoDeliverEnabled,
  })

  const mutation = useMutation({
    mutationFn: (partyAutoDeliverEnabled: boolean) =>
      api.patch<ApiResponse<SystemSettings>>('/steam/admin/settings', { partyAutoDeliverEnabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.settings.system() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '자동발송 설정 저장에 실패했습니다.')
    },
  })

  return { enabled: query.data ?? false, isLoading: query.isLoading, save: mutation.mutate }
}
