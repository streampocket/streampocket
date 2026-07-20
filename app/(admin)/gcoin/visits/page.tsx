'use client'

import { useState } from 'react'
import { getTodayStringKST } from '@/lib/utils'
import { VisitFilterBar } from './_components/VisitFilterBar'
import { VisitStatCards } from './_components/VisitStatCards'
import { DailyVisitsChart } from './_components/DailyVisitsChart'
import { SourceTable } from './_components/SourceTable'
import { useVisitStats } from './_hooks/useVisitStats'
import type { VisitSite } from './_types'

const DEFAULT_RANGE_DAYS = 30

function kstDaysAgo(days: number): string {
  const todayKst = new Date(`${getTodayStringKST()}T00:00:00.000Z`)
  todayKst.setUTCDate(todayKst.getUTCDate() - days)
  return todayKst.toISOString().slice(0, 10)
}

export default function VisitsPage() {
  const [site, setSite] = useState<VisitSite>('ottall')
  const [from, setFrom] = useState(() => kstDaysAgo(DEFAULT_RANGE_DAYS - 1))
  const [to, setTo] = useState(() => getTodayStringKST())

  const { data, isLoading } = useVisitStats({ site, from, to })
  const stats = data?.data

  const handleRangeChange = (nextFrom: string, nextTo: string) => {
    setFrom(nextFrom)
    setTo(nextTo)
  }

  return (
    <div className="space-y-4">
      <VisitFilterBar
        site={site}
        onSiteChange={setSite}
        from={from}
        to={to}
        onRangeChange={handleRangeChange}
      />

      <VisitStatCards stats={stats} />

      {isLoading ? (
        <div className="py-16 text-center">
          <p className="text-body-md text-text-muted">로딩 중...</p>
        </div>
      ) : (
        <>
          <DailyVisitsChart daily={stats?.daily ?? []} />
          <SourceTable
            sources={stats?.sources ?? []}
            otherHosts={stats?.otherHosts ?? []}
            totalVisits={stats?.totalVisits ?? 0}
          />
        </>
      )}
    </div>
  )
}
