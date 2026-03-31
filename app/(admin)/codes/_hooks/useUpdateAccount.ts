import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

type UpdateAccountInput = {
  id: string
  data: {
    username: string
    password: string
    email: string
    emailPassword: string
    emailSiteUrl: string
  }
}

export function useUpdateAccount(onClose: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdateAccountInput) => api.put(`/steam/admin/accounts/${id}`, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts.all() })
      onClose()
    },
  })
}
