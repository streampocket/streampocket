import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { ApiResponse } from '@/types/api'
import type { MonthlyAdjustment } from '@/types/domain'

type UpdateAdjustmentInput = {
  yearMonth: string
  paymentAdjustment: number
  commissionAdjustment: number
  netRevenueAdjustment: number
  memo?: string
}

export function useUpdateMonthlyAdjustment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ yearMonth, ...body }: UpdateAdjustmentInput) =>
      api.put<ApiResponse<MonthlyAdjustment>>(
        `/steam/admin/settings/adjustments/${yearMonth}`,
        body,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
