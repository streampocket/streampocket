import type { Metadata } from 'next'
import { PaymentResultClient } from './_components/PaymentResultClient'

export const metadata: Metadata = {
  title: '결제 결과 | OTTALL',
  robots: { index: false, follow: false },
}

export default function PaymentResultPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-4">
      <PaymentResultClient />
    </main>
  )
}
