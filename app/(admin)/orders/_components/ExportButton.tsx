'use client'

import { useExportOrders } from '../_hooks/useExportOrders'
import { Button } from '@/components/ui/Button'

type Props = {
  status?: string
  from?: string
  to?: string
  source?: string
}

export function ExportButton({ status, from, to, source }: Props) {
  const { exportOrders, isExporting } = useExportOrders()

  return (
    <Button
      variant="secondary"
      size="sm"
      loading={isExporting}
      onClick={() => exportOrders({ status, from, to, source })}
    >
      ⬇ 엑셀 추출
    </Button>
  )
}
