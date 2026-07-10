'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { OwnProduct, PartyType, PartyDurationMode } from '@/types/domain'

export type UpdateAdminPartyInput = {
  name?: string
  durationDays?: number
  price?: number
  dailyDiscount?: number
  totalSlots?: number
  partyType?: PartyType
  durationMode?: PartyDurationMode
  imagePath?: string | null
  notes?: string | null
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
    },
  })
}
