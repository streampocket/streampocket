'use client'

import { useExportAccounts } from '../_hooks/useExportAccounts'
import { Button } from '@/components/ui/Button'

type Props = {
  productId?: string
  status?: string
}

export function ExportButton({ productId, status }: Props) {
  const { exportAccounts, isExporting } = useExportAccounts()

  return (
    <Button
      variant="secondary"
      size="sm"
      loading={isExporting}
      onClick={() => exportAccounts({ productId, status })}
    >
      ⬇ 엑셀 추출
    </Button>
  )
}
