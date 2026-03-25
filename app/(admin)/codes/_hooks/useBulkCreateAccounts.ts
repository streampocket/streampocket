import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { BulkCreateBody } from '../_types'

export function useBulkCreateAccounts() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: BulkCreateBody) => api.post('/steam/admin/accounts/bulk', body),
    onSuccess: () => {
      toast.success('계정이 일괄 등록되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts.list() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '일괄 등록에 실패했습니다.')
    },
  })
}
