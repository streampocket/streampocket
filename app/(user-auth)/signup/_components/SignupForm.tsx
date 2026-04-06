'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { isUserAuthenticated } from '@/lib/userAuth'
import { cn } from '@/lib/utils'
import { USER_LOGIN_PATH, USER_MYPAGE_PATH } from '@/constants/app'
import { useSignup } from '../_hooks/useSignup'
import { PhoneVerificationStep } from './PhoneVerificationStep'

function validatePassword(password: string) {
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password)
  const categories = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length
  return {
    minLength: password.length >= 8,
    combination: categories >= 2,
    hasLetter,
    hasNumber,
    hasSpecial,
  }
}

export function SignupForm() {
  const router = useRouter()
  const { handleSignup, isLoading } = useSignup()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [phone, setPhone] = useState('')
  const [verificationId, setVerificationId] = useState<string | null>(null)

  useEffect(() => {
    if (isUserAuthenticated()) {
      router.replace(USER_MYPAGE_PATH)
    }
  }, [router])

  const pwValidation = useMemo(() => validatePassword(password), [password])
  const passwordsMatch = password === passwordConfirm
  const isFormValid =
    name.trim().length >= 2 &&
    email.includes('@') &&
    pwValidation.minLength &&
    pwValidation.combination &&
    passwordsMatch &&
    verificationId !== null

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isFormValid || !verificationId) return

    await handleSignup({
      name: name.trim(),
      email,
      password,
      phone: phone.replace(/-/g, ''),
      verificationId,
    })
  }

  const inputClass = cn(
    'w-full rounded-lg border border-border bg-white px-3 py-2.5',
    'text-body-md text-text-primary placeholder:text-text-muted',
    'outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-light',
  )

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={onSubmit}
        className="rounded-xl border border-border bg-card-bg p-6 shadow-[0_1px_3px_rgba(0,0,0,.08),0_1px_2px_rgba(0,0,0,.06)]"
      >
        <h2 className="mb-6 text-center text-heading-lg text-text-primary">회원가입</h2>

        {/* 이름 */}
        <div className="mb-4">
          <label className="text-caption-md mb-1.5 block font-semibold text-text-secondary">
            이름
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="2자 이상"
            maxLength={20}
            required
            className={inputClass}
          />
        </div>

        {/* 이메일 */}
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
            className={inputClass}
          />
        </div>

        {/* 비밀번호 */}
        <div className="mb-4">
          <label className="text-caption-md mb-1.5 block font-semibold text-text-secondary">
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8자 이상, 영문/숫자/특수문자 중 2가지 조합"
            required
            className={inputClass}
          />
          {password.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              <span
                className={cn(
                  'text-caption-sm rounded px-1.5 py-0.5',
                  pwValidation.minLength
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-600',
                )}
              >
                8자 이상
              </span>
              <span
                className={cn(
                  'text-caption-sm rounded px-1.5 py-0.5',
                  pwValidation.hasLetter
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500',
                )}
              >
                영문
              </span>
              <span
                className={cn(
                  'text-caption-sm rounded px-1.5 py-0.5',
                  pwValidation.hasNumber
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500',
                )}
              >
                숫자
              </span>
              <span
                className={cn(
                  'text-caption-sm rounded px-1.5 py-0.5',
                  pwValidation.hasSpecial
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500',
                )}
              >
                특수문자
              </span>
            </div>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div className="mb-4">
          <label className="text-caption-md mb-1.5 block font-semibold text-text-secondary">
            비밀번호 확인
          </label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="비밀번호를 다시 입력"
            required
            className={cn(
              inputClass,
              passwordConfirm.length > 0 &&
                !passwordsMatch &&
                'border-red-400 focus:border-red-400 focus:ring-red-100',
            )}
          />
          {passwordConfirm.length > 0 && !passwordsMatch && (
            <p className="mt-1 text-caption-sm text-red-500">비밀번호가 일치하지 않습니다.</p>
          )}
        </div>

        {/* 전화번호 인증 */}
        <div className="mb-6">
          <PhoneVerificationStep
            phone={phone}
            onPhoneChange={setPhone}
            onVerified={setVerificationId}
          />
        </div>

        <Button
          type="submit"
          loading={isLoading}
          disabled={!isFormValid}
          className="h-11 w-full text-base"
        >
          가입하기
        </Button>
      </form>

      <p className="text-center text-body-md text-text-secondary">
        이미 계정이 있으신가요?{' '}
        <Link
          href={USER_LOGIN_PATH}
          className="font-semibold text-brand hover:text-brand-dark"
        >
          로그인
        </Link>
      </p>
    </div>
  )
}
