'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { toast } from 'sonner'

type ExpandInput = {
  productId: string
  // 절대값 PATCH라 현재 정원이 필요하다 — 화면에 보이는 값 기준 +1
  currentTotalSlots: number
}

// 정원 초과 대기 신청을 받기 위한 임시 확대. 정원 수정은 파티 status를 건드리지 않으므로
// 마감(closed)된 파티는 늘려도 유저에게 재공개되지 않는다 — 승인으로만 자리가 채워진다.
export function useExpandPartySlots() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, currentTotalSlots }: ExpandInput) =>
      api.patch(`/own/admin/products/${productId}`, { totalSlots: currentTotalSlots + 1 }),
    onSuccess: (_data, variables) => {
      toast.success(`모집 인원을 ${variables.currentTotalSlots + 1}명으로 늘렸습니다.`)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminApplications.all() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminParties.all() })
      // 유저 화면(파티 목록·상세)의 모집 현황도 갱신
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ownProducts.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '모집 인원 변경에 실패했습니다.')
    },
  })
}
