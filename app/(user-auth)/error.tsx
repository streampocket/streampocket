'use client'

import { UserErrorFallback } from '@/components/error/UserErrorFallback'

// default export는 Next.js error 파일 규약상 필수 (page.tsx와 동일한 프레임워크 예외)
export default function Error(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <UserErrorFallback {...props} />
}
