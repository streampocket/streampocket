import type { Metadata } from 'next'
import { Suspense } from 'react'
import { USER_BRAND_NAME } from '@/constants/app'
import { SocialPhoneForm } from './_components/SocialPhoneForm'

export const metadata: Metadata = {
  title: `전화번호 인증 | ${USER_BRAND_NAME}`,
}

export default function SocialPhonePage() {
  return (
    <Suspense>
      <SocialPhoneForm />
    </Suspense>
  )
}
