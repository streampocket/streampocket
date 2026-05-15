import type { Metadata } from 'next'
import { BRAND_NAME } from '@/constants/app'
import { TrackClient } from './_components/TrackClient'

export const metadata: Metadata = {
  title: `주문 진행상황 조회 | ${BRAND_NAME}`,
  description: '상품주문번호를 입력하면 주문 처리 진행 상황을 실시간으로 확인할 수 있습니다.',
  robots: { index: false, follow: false },
}

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-content-bg py-8">
      <main className="mx-auto w-full max-w-xl px-4">
        <header className="mb-6 overflow-hidden rounded-2xl bg-brand px-6 py-9 text-center">
          <h1 className="text-heading-lg font-bold text-white">주문 진행상황 조회</h1>
          <p className="mt-2 text-body-md text-white/80">
            상품주문번호를 입력하면 처리 단계를 확인할 수 있어요.
          </p>
        </header>
        <TrackClient />
      </main>
    </div>
  )
}
