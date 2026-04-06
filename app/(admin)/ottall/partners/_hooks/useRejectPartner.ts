'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

type RejectPayload = {
  id: string
  rejectionNote?: string
}

export function useRejectPartner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, rejectionNote }: RejectPayload) =>
      api.patch(`/own/admin/partners/${id}/reject`, { rejectionNote }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminPartners.all() })
      toast.success('파트너 신청이 거절되었습니다.')
    },
    onError: (error: Error) => {
      toast.error(error.message || '거절에 실패했습니다.')
    },
  })
}
