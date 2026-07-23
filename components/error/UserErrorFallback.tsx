'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { reportUserError } from '@/lib/reportUserError'

type UserErrorFallbackProps = {
  error: Error & { digest?: string }
  reset: () => void
}

// 유저 사이트(OTTALL) 공통 에러 폴백 — 각 세그먼트 error.tsx가 위임한다
export function UserErrorFallback({ error, reset }: UserErrorFallbackProps) {
  useEffect(() => {
    reportUserError(error, window.location.pathname)
  }, [error])

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-5 text-center">
      <p className="text-4xl">😥</p>
      <h2 className="text-xl font-bold text-text-primary">문제가 발생했습니다</h2>
      <p className="max-w-md text-body-md text-text-secondary">
        일시적인 오류일 수 있어요. 다시 시도해도 계속되면 잠시 후 이용해 주세요.
      </p>
      <div className="mt-2 flex items-center gap-3">
        <Button onClick={reset}>다시 시도</Button>
        <Link
          href="/"
          className="inline-flex h-9 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 px-4 text-body-md font-semibold text-gray-700 transition-colors hover:bg-gray-200"
        >
          홈으로
        </Link>
      </div>
    </main>
  )
}
