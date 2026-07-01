'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { OwnProduct, PartyType } from '@/types/domain'

export type UpdateAdminPartyInput = {
  name?: string
  durationDays?: number
  price?: number
  dailyDiscount?: number
  totalSlots?: number
  partyType?: PartyType
  imagePath?: string | null
  notes?: string | null
  accountId?: string | null
  accountPassword?: string | null
  leaderName?: string
}

type UpdateResponse = {
  data: OwnProduct
}

export function useUpdateAdminParty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAdminPartyInput }) =>
      api.patch<UpdateResponse>(`/own/admin/products/${id}`, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminParties.all() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminParties.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminParties.credentials(variables.id) })
    },
  })
}
