import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

export function useDeleteAccount(onClose: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.delete(`/steam/admin/accounts/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts.all() })
      onClose()
    },
    onError: (error: Error) => {
      window.alert(error.message)
    },
  })
}
