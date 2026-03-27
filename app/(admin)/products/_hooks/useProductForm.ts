import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ProductFormData } from '../_types'

export function useProductForm() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.all() })
  }

  const create = useMutation({
    mutationFn: (data: ProductFormData) => api.post('/steam/admin/products', data),
    onSuccess: () => {
      toast.success('상품이 등록되었습니다.')
      invalidate()
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '등록에 실패했습니다.')
    },
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductFormData> }) =>
      api.patch(`/steam/admin/products/${id}`, data),
    onSuccess: () => {
      toast.success('상품이 수정되었습니다.')
      invalidate()
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '수정에 실패했습니다.')
    },
  })

  return { create, update }
}
