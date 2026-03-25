import type { Metadata } from 'next'
import { Suspense } from 'react'
import { OrdersFilterBar } from './_components/OrdersFilterBar'
import { OrdersTable } from './_components/OrdersTable'

export const metadata: Metadata = {
  title: '주문 관리',
}

export default function OrdersPage() {
  return (
    <div className="space-y-4">
      <Suspense>
        <OrdersFilterBar />
      </Suspense>
      <Suspense>
        <OrdersTable />
      </Suspense>
    </div>
  )
}
