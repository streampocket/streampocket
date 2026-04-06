import type { Metadata } from 'next'
import { Suspense } from 'react'
import { USER_BRAND_NAME } from '@/constants/app'
import { SocialCallbackHandler } from './_components/SocialCallbackHandler'

export const metadata: Metadata = {
  title: `로그인 처리 중 | ${USER_BRAND_NAME}`,
}

export default function SocialCallbackPage() {
  return (
    <Suspense>
      <SocialCallbackHandler />
    </Suspense>
  )
}
