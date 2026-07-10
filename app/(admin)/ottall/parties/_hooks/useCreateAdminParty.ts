'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { OwnProduct, PartyType, PartyDurationMode } from '@/types/domain'

export type CreateAdminPartyInput = {
  name: string
  durationDays: number
  price: number
  dailyDiscount: number
  totalSlots: number
  partyType: PartyType
  durationMode: PartyDurationMode
  imagePath?: string | null
  notes?: string | null
  leaderName: string
}

type CreateResponse = {
  data: OwnProduct
}

export function useCreateAdminParty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateAdminPartyInput) =>
      api.post<CreateResponse>('/own/admin/products', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminParties.all() })
    },
  })
}
