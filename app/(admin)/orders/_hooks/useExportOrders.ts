'use client'

import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'

type ExportOrdersParams = {
  status?: string
  from?: string
  to?: string
}

function buildFilename(): string {
  const date = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Seoul' }).format(new Date()).replace(/\. /g, '').replace('.', '')
  return `orders_${date}.xlsx`
}

export function useExportOrders(): {
  exportOrders: (params: ExportOrdersParams) => void
  isExporting: boolean
} {
  const { mutate, isPending } = useMutation({
    mutationFn: (params: ExportOrdersParams) => {
      const qs = new URLSearchParams()
      if (params.status) qs.set('status', params.status)
      if (params.from) qs.set('from', params.from)
      if (params.to) qs.set('to', params.to)
      const query = qs.toString()
      return api.download(
        `/steam/admin/orders/export${query ? `?${query}` : ''}`,
        buildFilename(),
      )
    },
  })

  return { exportOrders: mutate, isExporting: isPending }
}
