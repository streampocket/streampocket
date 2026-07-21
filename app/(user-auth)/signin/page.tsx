import type { Metadata } from 'next'
import { Suspense } from 'react'
import { USER_BRAND_NAME, USER_SITE_URL } from '@/constants/app'
import { UserLoginForm } from './_components/UserLoginForm'

export const metadata: Metadata = {
  title: `로그인 | ${USER_BRAND_NAME}`,
  description: `${USER_BRAND_NAME} 로그인`,
  alternates: { canonical: `${USER_SITE_URL}/signin` },
}

export default function UserLoginPage() {
  return (
    <Suspense>
      <UserLoginForm />
    </Suspense>
  )
}
