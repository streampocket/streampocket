import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ApiResponse } from '@/types/api'
import type { ReviewCodeBatchFormData } from '../_types'

type BatchResult = { count: number }

export function useCreateReviewCodeBatch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ReviewCodeBatchFormData) =>
      api.post<ApiResponse<BatchResult>>('/steam/admin/review-codes/batch', data),
    onSuccess: (res) => {
      toast.success(`${res.data.count}개의 코드가 등록되었습니다.`)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviewCodes.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '일괄 등록에 실패했습니다.')
    },
  })
}
