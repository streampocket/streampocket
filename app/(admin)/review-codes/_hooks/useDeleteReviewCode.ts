import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

export function useDeleteReviewCode() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.delete(`/steam/admin/review-codes/${id}`),
    onSuccess: () => {
      toast.success('코드가 삭제되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviewCodes.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '삭제에 실패했습니다.')
    },
  })
}
