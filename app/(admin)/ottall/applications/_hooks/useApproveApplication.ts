'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { describeAutoAssignReason } from '@/constants/app'
import { toast } from 'sonner'

/** 승인 직후 수행한 계정 자동 배정 결과 */
type AutoAssignOutcome = {
  /** 자동 배정을 시도했는지 (토글 OFF면 false) */
  attempted: boolean
  assigned: boolean
  reason: string | null
}

type ApproveResponse = {
  autoRejected: boolean
  // 이번 승인으로 파티가 정원을 채워 모집완료됐는지 — true면 동일 파티 재생성 여부 확인
  partyClosed: boolean
  productId: string | null
  autoAssign: AutoAssignOutcome
}

/** 승인 결과를 한 줄 토스트로 — 배정은 실패해도 승인 자체는 끝난 상태다 */
function notifyApproveResult(response: ApproveResponse): void {
  if (response.autoRejected) {
    toast.warning('정원이 가득 차 자동으로 거절 처리되었습니다.')
    return
  }

  const auto = response.autoAssign
  if (!auto.attempted) {
    toast.success('신청을 승인했습니다.')
    return
  }
  if (auto.assigned) {
    toast.success('승인 완료 — 계정을 배정했습니다. 안내 양식을 복사해 전달해 주세요.')
    return
  }
  toast.warning(`승인은 됐지만 계정 자동 배정에 실패했습니다. ${describeAutoAssignReason(auto.reason)}`)
}

export function useApproveApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      applicationId,
      autoAssign,
      dramaAccountId,
    }: {
      applicationId: string
      autoAssign: boolean
      /**
       * 관리자가 후보 목록에서 **추천과 다른 계정을 고른 경우에만** 넘긴다.
       * 없으면 요청 본문에 키를 담지 않아 서버가 기존과 같은 자동 선택을 한다 —
       * 추천 계정을 굳이 지정해 보내면, 모달을 열어둔 사이 그 계정의 자리가 차면
       * 지금은 조용히 다른 계정으로 배정되던 건이 실패로 바뀐다.
       */
      dramaAccountId?: string
    }) =>
      api.post<ApproveResponse>(`/own/admin/applications/${applicationId}/approve`, {
        autoAssign,
        ...(dramaAccountId ? { dramaAccountId } : {}),
      }),
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
