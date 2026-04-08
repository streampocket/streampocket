'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { toast } from 'sonner'
import type { OwnProductStatus } from '@/types/domain'

export function useUpdatePartyStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OwnProductStatus }) =>
      api.patch(`/own/admin/products/${id}/status`, { status }),
    onSuccess: () => {
      toast.success('파티 상태가 변경되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminParties.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '상태 변경에 실패했습니다.')
    },
  })
}
