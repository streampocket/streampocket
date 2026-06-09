import type { Metadata } from 'next'
import { Suspense } from 'react'
import { RevenuePageClient } from './_components/RevenuePageClient'

export const metadata: Metadata = {
  title: '매출 관리',
}

export default function RevenuePage() {
  return (
    <Suspense>
      <RevenuePageClient />
    </Suspense>
  )
}
