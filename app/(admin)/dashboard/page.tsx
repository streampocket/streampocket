import type { Metadata } from 'next'
import { StatsGrid } from './_components/StatsGrid'
import { RevenueStats } from './_components/RevenueStats'
import { OrderStatusChart } from './_components/OrderStatusChart'
import { StockChart } from './_components/StockChart'
import { RecentOrdersTable } from './_components/RecentOrdersTable'

export const metadata: Metadata = {
  title: '대시보드',
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <RevenueStats />

      <StatsGrid />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <OrderStatusChart />
        <StockChart />
      </div>

      <RecentOrdersTable />
    </div>
  )
}
