'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useAdminMe } from '@/hooks/useAdminMe'
import { api } from '@/lib/api'
import type { ApiResponse } from '@/types/api'
import type { SystemSettings } from '@/types/domain'

/**
 * 승인 모달의 계정 자동 배정 토글 — 마지막에 둔 상태를 전역(SystemSettings)에 저장한다.
 * 승인 건마다 고르게 하지 않는 이유: 운영 방식이 바뀌지 않는 한 매번 같은 값을 고르게 되기 때문.
 *
 * 조회는 값 하나만 주는 읽기 전용 API — 직원도 사장이 정한 값대로 승인한다.
 * 변경은 시스템 설정 PATCH(사장 전용)로 토글 하나만 보낸다 — 서버가 필드별 부분 업데이트라 다른 설정은 건드리지 않는다.
 */
export function usePartyAutoAssignSetting() {
  const queryClient = useQueryClient()
  const { data: me } = useAdminMe()

  const query = useQuery({
    queryKey: QUERY_KEYS.settings.partyAutoAssign(),
    queryFn: () =>
      api.get<ApiResponse<{ partyAutoAssignEnabled: boolean }>>(
        '/steam/admin/settings/party-auto-assign',
      ),
    select: (response) => response.data.partyAutoAssignEnabled,
  })

  const mutation = useMutation({
    mutationFn: (partyAutoAssignEnabled: boolean) =>
      api.patch<ApiResponse<SystemSettings>>('/steam/admin/settings', { partyAutoAssignEnabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.settings.partyAutoAssign() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.settings.system() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '자동 배정 설정 저장에 실패했습니다.')
    },
  })

  return {
    enabled: query.data ?? false,
    isLoading: query.isLoading,
    save: mutation.mutate,
    // 설정 변경은 사장만 — 직원은 현재 값으로 승인만 한다
    canEdit: me?.role === 'owner',
  }
}
