import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

// 되돌리기(분리) — 리스팅을 새 게임으로 떼어냄(병합 취소). 계정은 원 게임에 잔류.
export function useSplitListing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (listingId: string) =>
      api.patch(`/steam/admin/games/listings/${listingId}/split`, {}),
    onSuccess: () => {
      toast.success('리스팅을 분리했습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.games.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '분리에 실패했습니다.')
    },
  })
}
