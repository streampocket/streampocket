'use client'

import { useState } from 'react'
import { getTodayStringKST } from '@/lib/utils'
import { VisitFilterBar } from './_components/VisitFilterBar'
import { VisitStatCards } from './_components/VisitStatCards'
import { DailyVisitsChart } from './_components/DailyVisitsChart'
import { HourlyApplicationsChart } from './_components/HourlyApplicationsChart'
import { SourceTable } from './_components/SourceTable'
import { useVisitStats } from './_hooks/useVisitStats'
import { useApplicationHours } from './_hooks/useApplicationHours'
import { useSignupStats } from './_hooks/useSignupStats'
import { DEFAULT_RANGE_DAYS } from './_types'
import type { VisitSite } from './_types'

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

  // 파티·회원은 OTTALL 전용이라 지코인 탭에서는 요청 자체를 보내지 않는다
  const isOttall = site === 'ottall'
  const { data: hourData, isLoading: hourLoading } = useApplicationHours({ from, to }, isOttall)
  const { data: signupData } = useSignupStats({ from, to }, isOttall)

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

      <VisitStatCards stats={stats} signup={signupData?.data} showSignup={isOttall} />

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
          {isOttall && (
            <HourlyApplicationsChart stats={hourData?.data} isLoading={hourLoading} />
          )}
        </>
      )}
    </div>
  )
}
