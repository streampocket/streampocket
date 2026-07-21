import type { Metadata } from 'next'
import { Suspense } from 'react'
import { USER_BRAND_NAME } from '@/constants/app'
import { SocialPhoneForm } from './_components/SocialPhoneForm'

export const metadata: Metadata = {
  title: `전화번호 인증 | ${USER_BRAND_NAME}`,
  // 가입 절차 중간 페이지 — 색인 제외
  robots: { index: false, follow: false },
}

export default function SocialPhonePage() {
  return (
    <Suspense>
      <SocialPhoneForm />
    </Suspense>
  )
}
