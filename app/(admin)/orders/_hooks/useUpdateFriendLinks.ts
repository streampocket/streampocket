import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

type UpdateFriendLinksInput = {
  id: string
  friendLink1: string | null
  friendLink2: string | null
}

export function useUpdateFriendLinks() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, friendLink1, friendLink2 }: UpdateFriendLinksInput) =>
      api.patch(`/steam/admin/orders/${id}/friend-links`, { friendLink1, friendLink2 }),
    onSuccess: (_, variables) => {
      toast.success('친구 링크가 저장되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '친구 링크 저장에 실패했습니다.')
    },
  })
}
