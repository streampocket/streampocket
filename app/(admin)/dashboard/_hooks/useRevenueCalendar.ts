import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { RevenueCalendarItem } from '../_types'
import type { ApiResponse } from '@/types/api'

export function useRevenueCalendar(yearMonth: string, store: string = '') {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard.calendar(yearMonth, store),
    queryFn: () =>
      api.get<ApiResponse<RevenueCalendarItem[]>>(
        `/steam/admin/dashboard/revenue-calendar?yearMonth=${yearMonth}${store ? `&store=${store}` : ''}`,
      ),
    select: (res) => res.data,
    refetchInterval: 300_000,
  })
}
