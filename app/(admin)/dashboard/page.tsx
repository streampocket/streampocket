import type { Metadata } from 'next'
import { Suspense } from 'react'
import { StoreTabs } from '@/components/StoreTabs'
import { StatsGrid } from './_components/StatsGrid'
import { RevenueStats } from './_components/RevenueStats'
import { RevenueChart } from './_components/RevenueChart'
import { DashboardExtras } from './_components/DashboardExtras'
import { RecentOrdersTable } from './_components/RecentOrdersTable'

export const metadata: Metadata = {
  title: '대시보드',
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Suspense>
        <StoreTabs />
      </Suspense>

      <Suspense>
        <RevenueStats />
      </Suspense>

      <Suspense>
        <StatsGrid />
      </Suspense>

      <Suspense>
        <RevenueChart />
      </Suspense>

      <Suspense>
        <DashboardExtras />
      </Suspense>

      <Suspense>
        <RecentOrdersTable />
      </Suspense>
    </div>
  )
}
