import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ReviewCode } from '@/types/domain'
import type { ApiResponse } from '@/types/api'
import type { ReviewCodeFormData } from '../_types'

export function useUpdateReviewCode() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReviewCodeFormData }) =>
      api.put<ApiResponse<ReviewCode>>(`/steam/admin/review-codes/${id}`, data),
    onSuccess: () => {
      toast.success('코드가 수정되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviewCodes.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '수정에 실패했습니다.')
    },
  })
}
