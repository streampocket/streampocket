import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

type MergeGameInput = {
  sourceId: string
  targetGameId: string
}

// 게임 병합 — 소스 게임을 대상 게임으로 합침(리스팅/계정/주문 이동 + 빈 게임 삭제)
export function useMergeGame(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ sourceId, targetGameId }: MergeGameInput) =>
      api.patch(`/steam/admin/games/${sourceId}/merge-into`, { targetGameId }),
    onSuccess: () => {
      toast.success('게임을 병합했습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.games.all() })
      onSuccess?.()
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '병합에 실패했습니다.')
    },
  })
}
