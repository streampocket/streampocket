import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

export function useDisableAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.patch(`/steam/admin/accounts/${id}/disable`),
    onSuccess: () => {
      toast.success('계정이 비활성화되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '비활성화에 실패했습니다.')
    },
  })
}
