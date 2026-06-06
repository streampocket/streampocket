import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { Store } from '@/types/domain'

type SyncOutcome = { store: Store } & { error?: string }
type SyncResponse = { data: SyncOutcome[] }

export function useSyncGames() {
  const queryClient = useQueryClient()

  return useMutation({
    // store 미지정 시 전체 스토어를 스토어별 오류 격리로 동기화
    mutationFn: (store?: Store) =>
      api.post<SyncResponse>(`/steam/admin/games/sync${store ? `?store=${store}` : ''}`),
    onSuccess: (res) => {
      const failed = res.data.filter((r) => r.error)
      if (failed.length > 0) {
        toast.warning(`일부 스토어 동기화 실패: ${failed.map((f) => f.store).join(', ')}`)
      } else {
        toast.success('네이버 상품 동기화가 완료되었습니다.')
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.games.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '동기화에 실패했습니다.')
    },
  })
}
