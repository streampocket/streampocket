'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

type CancelPartyMemberResponse = {
  data: {
    productName: string
    userName: string | null
    filledSlots: number
    totalSlots: number
    partyReopened: boolean
    /** 함께 반품 처리된 파티 주문 수 */
    orderReturned: number
    /** 반품에 실패한 주문 수 — 주문관리에서 수동 반품 필요 */
    orderReturnFailed: number
  }
}

// 확정 파티원 제거 — 파티원 제외 + 연결된 파티 주문 자동 반품.
// 재실행해도 인원이 중복 감소하지 않는다(서버 멱등 가드).
export function useCancelPartyMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (applicationId: string) =>
      api.post<CancelPartyMemberResponse>(`/own/admin/applications/${applicationId}/cancel`, {}),
    onSuccess: (response) => {
      const { userName, filledSlots, totalSlots, partyReopened, orderReturned, orderReturnFailed } =
        response.data
      const name = userName ?? '파티원'
      const reopened = partyReopened ? ' 파티는 다시 모집중으로 전환되었습니다.' : ''
      toast.success(
        `${name} 님을 파티에서 제거했습니다 (${filledSlots}/${totalSlots}).${reopened}${
          orderReturned > 0 ? ` 연결 주문 ${orderReturned}건 반품 완료.` : ''
        }`,
      )
      if (orderReturnFailed > 0) {
        toast.warning(
          `연결된 주문 ${orderReturnFailed}건의 반품에 실패했습니다. 주문관리에서 수동 반품이 필요합니다.`,
        )
      }

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminParties.all() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminApplications.all() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all() })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '파티원 제거에 실패했습니다.')
    },
  })
}
