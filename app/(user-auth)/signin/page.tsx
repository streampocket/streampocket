import type { Metadata } from 'next'
import { Suspense } from 'react'
import { USER_BRAND_NAME } from '@/constants/app'
import { UserLoginForm } from './_components/UserLoginForm'

export const metadata: Metadata = {
  title: `로그인 | ${USER_BRAND_NAME}`,
  description: `${USER_BRAND_NAME} 로그인`,
}

export default function UserLoginPage() {
  return (
    <Suspense>
      <UserLoginForm />
    </Suspense>
  )
}
