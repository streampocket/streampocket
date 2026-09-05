'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { describeAutoDeliverReason } from '@/constants/app'
import { toast } from 'sonner'

/** 승인 직후 수행한 계정 자동 배정 + 알림톡 발송 결과 */
type AutoDeliverOutcome = {
  /** 자동발송을 시도했는지 (토글 OFF면 false) */
  attempted: boolean
  assigned: boolean
  sent: boolean
  reason: string | null
}

type ApproveResponse = {
  autoRejected: boolean
  // 이번 승인으로 파티가 정원을 채워 모집완료됐는지 — true면 동일 파티 재생성 여부 확인
  partyClosed: boolean
  productId: string | null
  autoDeliver: AutoDeliverOutcome
}

/** 승인 결과를 한 줄 토스트로 — 자동발송은 실패해도 승인 자체는 끝난 상태다 */
function notifyApproveResult(response: ApproveResponse): void {
  if (response.autoRejected) {
    toast.warning('정원이 가득 차 자동으로 거절 처리되었습니다.')
    return
  }

  const auto = response.autoDeliver
  if (!auto.attempted) {
    toast.success('신청을 승인했습니다.')
    return
  }
  if (auto.assigned && auto.sent) {
    toast.success('승인 완료 — 계정을 배정하고 알림톡을 보냈습니다.')
    return
  }
  if (auto.assigned) {
    toast.warning(`승인·계정 배정은 됐지만 알림톡 발송에 실패했습니다. ${describeAutoDeliverReason(auto.reason)}`)
    return
  }
  toast.warning(`승인은 됐지만 계정 자동 배정에 실패했습니다. ${describeAutoDeliverReason(auto.reason)}`)
}

export function useApproveApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ applicationId, autoDeliver }: { applicationId: string; autoDeliver: boolean }) =>
      api.post<ApproveResponse>(`/own/admin/applications/${applicationId}/approve`, { autoDeliver }),
    onSuccess: (response) => {
      notifyApproveResult(response)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminApplications.all() })
      // 승인으로 파티가 마감(모집완료)될 수 있으므로 파티 목록도 갱신
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminParties.all() })
      // 자동 배정이 주문의 OTP 등록 상태를 바꾸므로 주문 화면도 갱신
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '승인에 실패했습니다.')
    },
  })
}
