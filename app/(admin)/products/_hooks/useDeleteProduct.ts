import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

export function useDeleteProduct(onClose: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.delete(`/steam/admin/products/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.all() })
      toast.success('상품이 삭제되었습니다.')
      onClose()
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '삭제에 실패했습니다.')
    },
  })
}
