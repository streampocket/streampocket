'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { GcoinProduct, GcoinProductStatus } from '../_types'

export type UpdateGcoinProductInput = {
  name?: string
  gcoinAmount?: number
  salePrice?: number
  listPrice?: number | null
  description?: string | null
  imageUrl?: string | null
  sortOrder?: number
  status?: GcoinProductStatus
}

type UpdateResponse = {
  data: GcoinProduct
}

export function useUpdateGcoinProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateGcoinProductInput }) =>
      api.patch<UpdateResponse>(`/gcoin/admin/products/${id}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminGcoinProducts.all() })
    },
  })
}
