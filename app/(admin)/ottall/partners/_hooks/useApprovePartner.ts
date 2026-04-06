'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

export function useApprovePartner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.patch(`/own/admin/partners/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminPartners.all() })
      toast.success('파트너가 승인되었습니다.')
    },
    onError: (error: Error) => {
      toast.error(error.message || '승인에 실패했습니다.')
    },
  })
}
