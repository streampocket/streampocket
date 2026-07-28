'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { reportUserError } from '@/lib/reportUserError'

type UserErrorFallbackProps = {
  error: Error & { digest?: string }
  reset: () => void
}

// 브라우저 번역기가 DOM을 건드린 뒤 React가 노드를 지우다 나는 오류들.
// 크롬 계열과 사파리의 메시지 표현만 다를 뿐 같은 DOMException(NotFoundError)이다.
const DOM_CONFLICT_PATTERNS = [
  'not a child of this node',
  'the object can not be found here',
  'notfounderror',
  "failed to execute 'removechild'",
  "failed to execute 'insertbefore'",
]

function isDomConflictError(message: string): boolean {
  const lower = message.toLowerCase()
  return DOM_CONFLICT_PATTERNS.some((pattern) => lower.includes(pattern))
}

// 자동 복구를 이미 시도한 (경로::메시지) 키 — 모듈 스코프라 리마운트되어도 유지된다.
// 복구 직후 같은 오류가 또 나면 무한 루프가 되므로 경로당 1회만 시도한다.
const recoveryAttempted = new Set<string>()

// 유저 사이트(OTTALL) 공통 에러 폴백 — 각 세그먼트 error.tsx가 위임한다
export function UserErrorFallback({ error, reset }: UserErrorFallbackProps) {
  useEffect(() => {
    const pathname = window.location.pathname
    const key = `${pathname}::${error.message}`
    // reset()은 React가 DOM을 새로 그리게 하므로 번역 충돌은 대개 이때 해소된다.
    // 다만 다시 그리는 사이 번역기가 또 개입하면 실패할 수 있어 성공을 보장하지는 않는다.
    const willRecover = isDomConflictError(error.message) && !recoveryAttempted.has(key)
    if (willRecover) recoveryAttempted.add(key)

    reportUserError(error, pathname, { autoRecovered: willRecover })

    if (willRecover) reset()
    // reset은 렌더마다 새 함수라 의존성에 넣으면 재실행되므로 error만 추적한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
