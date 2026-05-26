import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ApiResponse } from '@/types/api'

export type AuthType = 'guard_disabled' | 'backup_code' | 'guard_live'

/** 양식 C에서 화면에 알려줄 가드 옵션 (코드 입력 / 폰 승인) */
export type GuardOptions = {
  codeType?: 'email' | 'device'
  confirmation: boolean
}

export type AutoFriendLinkCreds = {
  steamId: string
  steamPassword: string
  authType: AuthType
  backupCode?: string
}

export type AutoFriendLinkResult =
  | { status: 'completed'; inviteLink1: string; inviteLink2: string }
  | { status: 'guard_required'; sessionId: string; guardOptions: GuardOptions }

// 친구링크 자동 가져오기 1단계 (양식 B/A는 즉시 완료, 양식 C는 guard_required 반환)
export function useAutoFriendLink(orderId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (creds: AutoFriendLinkCreds) =>
      api.post<ApiResponse<AutoFriendLinkResult>>(
        `/steam/admin/orders/${orderId}/auto-friend-link`,
        creds,
      ),
    onSuccess: (res) => {
      if (res.data.status === 'completed') {
        toast.success('친구링크 2개를 가져와 저장했습니다.')
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.detail(orderId) })
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all() })
      }
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '자동 가져오기에 실패했습니다.')
    },
  })
}
