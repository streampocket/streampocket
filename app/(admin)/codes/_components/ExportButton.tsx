'use client'

import { useExportAccounts } from '../_hooks/useExportAccounts'
import { Button } from '@/components/ui/Button'

type Props = {
  gameId?: string
  status?: string
}

export function ExportButton({ gameId, status }: Props) {
  const { exportAccounts, isExporting } = useExportAccounts()

  return (
    <Button
      variant="secondary"
      size="sm"
      loading={isExporting}
      onClick={() => exportAccounts({ gameId, status })}
    >
      ⬇ 엑셀 추출
    </Button>
  )
}
