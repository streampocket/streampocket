'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import { GoofishReportTable } from './_components/GoofishReportTable'
import { GoofishScriptInstallGuide } from './_components/GoofishScriptInstallGuide'
import { useGoofishReport } from './_hooks/useGoofishReport'

export default function GoofishPage() {
  const [isGuideOpen, setIsGuideOpen] = useState(false)
  const { data, refetch, isFetching } = useGoofishReport()

  const latestCheckedAt = data?.products
    .map((p) => p.todayCheckedAt)
    .filter((v): v is string => v !== null)
    .sort()
    .at(-1)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-heading-md text-text-primary">Goofish 시세 모니터링</h2>
          <p className="text-caption-md mt-1 text-text-muted">
            {latestCheckedAt
              ? `마지막 수집: ${formatDate(latestCheckedAt)}`
              : '아직 수집 기록이 없습니다.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => refetch()} loading={isFetching}>
            새로고침
          </Button>
          <Button size="sm" onClick={() => setIsGuideOpen(true)}>
            스크립트 설치 가이드
          </Button>
        </div>
      </div>

      <GoofishReportTable />

      {isGuideOpen && <GoofishScriptInstallGuide onClose={() => setIsGuideOpen(false)} />}
    </div>
  )
}
