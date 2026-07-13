'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { GcoinProduct, GcoinProductCategory, GcoinProductStatus } from '../_types'

export type CreateGcoinProductInput = {
  name: string
  category: GcoinProductCategory
  gcoinAmount: number | null
  salePrice: number
  listPrice?: number | null
  listPriceUsd?: number | null
  description?: string | null
  imageUrl?: string | null
  sortOrder?: number
  status: GcoinProductStatus
}

type CreateResponse = {
  data: GcoinProduct
}

export function useCreateGcoinProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateGcoinProductInput) =>
      api.post<CreateResponse>('/gcoin/admin/products', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminGcoinProducts.all() })
    },
  })
}
