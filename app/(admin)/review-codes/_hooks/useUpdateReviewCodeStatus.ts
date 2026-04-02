import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ReviewCode } from '@/types/domain'
import type { ApiResponse } from '@/types/api'
import type { ReviewCodeStatusData } from '../_types'

export function useUpdateReviewCodeStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReviewCodeStatusData }) =>
      api.patch<ApiResponse<ReviewCode>>(`/steam/admin/review-codes/${id}/status`, data),
    onSuccess: (_, variables) => {
      const label = variables.data.status === 'used' ? '사용 처리' : '미사용 복원'
      toast.success(`${label}되었습니다.`)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviewCodes.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '상태 변경에 실패했습니다.')
    },
  })
}
