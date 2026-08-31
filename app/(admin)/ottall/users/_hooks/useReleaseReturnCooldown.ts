'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

type ReleaseResponse = {
  message: string
  data: { releasedCount: number }
}

/** 반품 재신청 차단(12시간) 유저 단위 일괄 해제 — 회원 상세 모달 액션 */
export function useReleaseReturnCooldown() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      api.post<ReleaseResponse>(`/own/admin/users/${userId}/release-return-cooldown`),
    onSuccess: (res, { userId }) => {
      toast.success(`재신청 차단 ${res.data.releasedCount}건을 해제했습니다.`)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminUsers.detail(userId) })
    },
    onError: (error: Error, { userId }) => {
      toast.error(error.message ?? '차단 해제에 실패했습니다.')
      // 409(이미 해제/12시간 자연 경과)면 화면이 낡은 것 — 상세를 다시 불러 섹션을 최신화한다
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminUsers.detail(userId) })
    },
  })
}
