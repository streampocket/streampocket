import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

export function useSendReviewGame() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.post(`/steam/admin/orders/${id}/review-game`),
    onSuccess: () => {
      toast.success('리뷰게임 코드 발송이 완료되었습니다.')
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '리뷰게임 발송에 실패했습니다.')
    },
    // 성공·실패(409 포함) 모두 목록과 상세를 무효화 → 새로고침 안 한 다른 관리자 화면도 최신 상태로 갱신
    onSettled: (_data, _error, id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.list() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.detail(id) })
    },
  })
}
