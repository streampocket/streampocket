import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ReviewCodesFilter } from './_components/ReviewCodesFilter'
import { ReviewCodesTable } from './_components/ReviewCodesTable'

export const metadata: Metadata = {
  title: '리뷰 게임 관리',
}

export default function ReviewCodesPage() {
  return (
    <div className="space-y-4">
      <Suspense>
        <ReviewCodesFilter />
      </Suspense>
      <Suspense>
        <ReviewCodesTable />
      </Suspense>
    </div>
  )
}
