import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { SteamProductType } from '@/types/domain'

type UpdateGameInput = {
  id: string
  data: { name?: string; productType?: SteamProductType }
}

export function useUpdateGame(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdateGameInput) =>
      api.patch(`/steam/admin/games/${id}`, data),
    onSuccess: () => {
      toast.success('게임 정보가 수정되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.games.all() })
      onSuccess?.()
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '수정에 실패했습니다.')
    },
  })
}
