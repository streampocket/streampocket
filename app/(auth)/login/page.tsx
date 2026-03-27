import { Suspense } from 'react'
import type { Metadata } from 'next'
import { LoginForm } from './_components/LoginForm'

export const metadata: Metadata = {
  title: '로그인',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-content-bg px-4">
      <div className="w-full max-w-95">
        {/* 로고 */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-xl font-bold text-white">
            SP
          </div>
          <h1 className="text-heading-lg text-text-primary">스트림포켓</h1>
          <p className="text-caption-md mt-1 text-text-secondary">관리자 시스템에 로그인하세요</p>
        </div>

        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
