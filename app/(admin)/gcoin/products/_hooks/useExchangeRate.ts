'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

type ExchangeRateResponse = {
  data: {
    rate: number
    fetchedAt: string
  } | null
}

/** 현재 USD→KRW 환율 (폼 환산 미리보기용). 아직 갱신된 적 없으면 data가 null */
export function useExchangeRate() {
  return useQuery({
    queryKey: QUERY_KEYS.adminGcoinExchangeRate.all(),
    queryFn: () => api.get<ExchangeRateResponse>('/gcoin/admin/exchange-rate'),
    staleTime: 5 * 60 * 1000, // 환율은 하루 3회 갱신이라 5분 캐시로 충분
  })
}
