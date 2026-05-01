'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { toast } from 'sonner'

export function useApproveApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (applicationId: string) =>
      api.post(`/own/admin/applications/${applicationId}/approve`, {}),
    onSuccess: () => {
      toast.success('신청을 승인했습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminApplications.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '승인에 실패했습니다.')
    },
  })
}
