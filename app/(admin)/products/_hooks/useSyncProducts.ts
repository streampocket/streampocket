import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

export function useSyncProducts() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => api.post('/steam/admin/products/sync'),
    onSuccess: () => {
      toast.success('네이버 상품 동기화가 완료되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.list() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '동기화에 실패했습니다.')
    },
  })
}
