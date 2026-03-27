'use client'

import { useExportOrders } from '../_hooks/useExportOrders'
import { Button } from '@/components/ui/Button'

type Props = {
  status?: string
  from?: string
  to?: string
}

export function ExportButton({ status, from, to }: Props) {
  const { exportOrders, isExporting } = useExportOrders()

  return (
    <Button
      variant="secondary"
      size="sm"
      loading={isExporting}
      onClick={() => exportOrders({ status, from, to })}
    >
      ⬇ 엑셀 추출
    </Button>
  )
}
