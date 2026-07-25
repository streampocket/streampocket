import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

// 파티 주문 반품 시 함께 수행되는 파티원 제거 결과.
// released=false여도 주문 반품 자체는 성공한 상태다(반품 보장 원칙).
type PartyMemberOutcome =
  | { released: true; userName: string | null; filledSlotsAfter: number; totalSlots: number; partyReopened: boolean }
  | { released: false; reason: 'not_found' | 'not_confirmed' | 'not_linked' | 'failed' }

type ManualReturnResponse = {
  message: string
  partyMember: PartyMemberOutcome | null
}

export function useManualReturn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.post<ManualReturnResponse>(`/steam/admin/orders/${id}/return`),
    onSuccess: (response) => {
      const member = response.partyMember

      if (member?.released) {
        const name = member.userName ?? '파티원'
        const reopened = member.partyReopened ? ' 파티는 다시 모집중으로 전환되었습니다.' : ''
        toast.success(
          `반품 처리 완료 — ${name} 님을 파티원에서 제거했습니다 (${member.filledSlotsAfter}/${member.totalSlots}).${reopened}`,
        )
      } else if (member && member.reason === 'not_linked') {
        toast.success('반품 처리 완료 (연결된 파티 신청이 없어 파티원은 변동 없음)')
      } else if (member && (member.reason === 'failed' || member.reason === 'not_confirmed')) {
        // 주문은 반품됐지만 파티원이 남아 있는 상태 — 파티관리에서 직접 제거하면 복구된다
        toast.warning('반품은 완료됐지만 파티원 제거에 실패했습니다. 파티관리에서 직접 제거해 주세요.')
      } else {
        toast.success('반품 처리가 완료되었습니다.')
      }

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.list() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all() })
      // 파티 인원·상태와 매출 집계가 함께 바뀌므로 관련 화면 캐시도 갱신
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminParties.all() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminApplications.all() })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '반품 처리에 실패했습니다.')
    },
  })
}
