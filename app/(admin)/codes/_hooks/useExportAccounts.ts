'use client'

import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'

type ExportAccountsParams = {
  productId?: string
  status?: string
}

function buildFilename(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  return `accounts_${date}.xlsx`
}

export function useExportAccounts(): {
  exportAccounts: (params: ExportAccountsParams) => void
  isExporting: boolean
} {
  const { mutate, isPending } = useMutation({
    mutationFn: (params: ExportAccountsParams) => {
      const qs = new URLSearchParams()
      if (params.productId) qs.set('productId', params.productId)
      if (params.status) qs.set('status', params.status)
      const query = qs.toString()
      return api.download(
        `/steam/admin/accounts/export${query ? `?${query}` : ''}`,
        buildFilename(),
      )
    },
  })

  return { exportAccounts: mutate, isExporting: isPending }
}
