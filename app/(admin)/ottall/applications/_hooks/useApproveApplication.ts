'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { toast } from 'sonner'

type ApproveResponse = {
  autoRejected: boolean
  // 이번 승인으로 파티가 정원을 채워 모집완료됐는지 — true면 동일 파티 재생성 여부 확인
  partyClosed: boolean
  productId: string | null
}

export function useApproveApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (applicationId: string) =>
      api.post<ApproveResponse>(`/own/admin/applications/${applicationId}/approve`, {}),
    onSuccess: (response) => {
      if (response.autoRejected) {
        toast.warning('정원이 가득 차 자동으로 거절 처리되었습니다.')
      } else {
        toast.success('신청을 승인했습니다.')
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminApplications.all() })
      // 승인으로 파티가 마감(모집완료)될 수 있으므로 파티 목록도 갱신
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminParties.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '승인에 실패했습니다.')
    },
  })
}
