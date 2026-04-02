import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ReviewCode } from '@/types/domain'
import type { ApiResponse } from '@/types/api'
import type { ReviewCodeFormData } from '../_types'

export function useCreateReviewCode() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ReviewCodeFormData) =>
      api.post<ApiResponse<ReviewCode>>('/steam/admin/review-codes', data),
    onSuccess: () => {
      toast.success('코드가 등록되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviewCodes.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '등록에 실패했습니다.')
    },
  })
}
