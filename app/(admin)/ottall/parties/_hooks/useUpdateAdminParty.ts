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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminParties.all() })
      // 정원·가격 수정은 신청 상세 모달의 모집 현황과 유저 화면(파티 목록·상세)에도 반영돼야 한다
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminApplications.all() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ownProducts.all() })
    },
  })
}
