import type { Metadata } from 'next'
import { Suspense } from 'react'
import { USER_BRAND_NAME, USER_SITE_URL } from '@/constants/app'
import { SignupForm } from './_components/SignupForm'

export const metadata: Metadata = {
  title: `회원가입 | ${USER_BRAND_NAME}`,
  description: `${USER_BRAND_NAME} 회원가입`,
  alternates: { canonical: `${USER_SITE_URL}/signup` },
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
