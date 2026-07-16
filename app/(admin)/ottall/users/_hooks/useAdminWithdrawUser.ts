'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

type WithdrawResponse = {
  message: string
  data: { withdrawnAt: string }
}

export function useAdminWithdrawUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      api.post<WithdrawResponse>(`/own/admin/users/${userId}/withdraw`, { reason }),
    onSuccess: (_data, { userId }) => {
      toast.success('탈퇴 처리가 완료되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminUsers.all() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminUsers.detail(userId) })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '탈퇴 처리에 실패했습니다.')
    },
  })
}
