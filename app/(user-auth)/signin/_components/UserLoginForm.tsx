'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { isUserAuthenticated } from '@/lib/userAuth'
import { cn } from '@/lib/utils'
import { USER_MYPAGE_PATH, USER_SIGNUP_PATH } from '@/constants/app'
import { useUserLogin } from '../_hooks/useUserLogin'
import { SocialLoginButtons } from './SocialLoginButtons'

export function UserLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { handleLogin, isLoading } = useUserLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (!isUserAuthenticated()) return

    const next = searchParams.get('next')
    router.replace(next?.startsWith('/') ? next : USER_MYPAGE_PATH)
  }, [router, searchParams])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await handleLogin(email, password)
  }

  return (
    <div className="flex flex-col gap-6">
      <SocialLoginButtons />

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-caption-md text-text-muted">또는</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-xl border border-border bg-card-bg p-6 shadow-[0_1px_3px_rgba(0,0,0,.08),0_1px_2px_rgba(0,0,0,.06)]"
      >
        <div className="mb-4">
          <label className="text-caption-md mb-1.5 block font-semibold text-text-secondary">
            이메일
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            required
            className={cn(
              'w-full rounded-lg border border-border bg-white px-3 py-2.5',
              'text-body-md text-text-primary placeholder:text-text-muted',
              'outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-light',
            )}
          />
        </div>

        <div className="mb-6">
          <label className="text-caption-md mb-1.5 block font-semibold text-text-secondary">
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8자 이상"
            required
            className={cn(
              'w-full rounded-lg border border-border bg-white px-3 py-2.5',
              'text-body-md text-text-primary placeholder:text-text-muted',
              'outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-light',
            )}
          />
        </div>

        <Button type="submit" loading={isLoading} className="h-11 w-full text-base">
          로그인
        </Button>
      </form>

      <p className="text-center text-body-md text-text-secondary">
        아직 계정이 없으신가요?{' '}
        <Link
          href={USER_SIGNUP_PATH}
          className="font-semibold text-brand hover:text-brand-dark"
        >
          회원가입
        </Link>
      </p>
    </div>
  )
}
