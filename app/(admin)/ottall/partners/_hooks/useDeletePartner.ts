'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

export function useDeletePartner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.delete(`/own/admin/partners/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminPartners.all() })
      toast.success('파트너가 삭제되었습니다.')
    },
    onError: (error: Error) => {
      toast.error(error.message || '삭제에 실패했습니다.')
    },
  })
}
