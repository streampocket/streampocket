import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PaymentResultClient } from './_components/PaymentResultClient'

export const metadata: Metadata = {
  title: '결제 결과 | OTTALL',
  robots: { index: false, follow: false },
}

export default function PaymentResultPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-4">
      <Suspense
        fallback={
          <div className="w-full rounded-xl border border-border bg-white p-6 text-center">
            <p className="text-body-md text-text-secondary">결제 결과를 확인하는 중입니다...</p>
          </div>
        }
      >
        <PaymentResultClient />
      </Suspense>
    </main>
  )
}
