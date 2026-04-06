'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { USER_LOGIN_PATH } from '@/constants/app'
import { PhoneVerificationStep } from '../../../../signup/_components/PhoneVerificationStep'
import { useCompleteSocialSignup } from '../_hooks/useCompleteSocialSignup'

export function SocialPhoneForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { handleComplete, isLoading } = useCompleteSocialSignup()

  const [phone, setPhone] = useState('')
  const [verificationId, setVerificationId] = useState<string | null>(null)
  const [tempToken, setTempToken] = useState<string | null>(null)

  useEffect(() => {
    const token = searchParams.get('tempToken')
    if (!token) {
      router.replace(USER_LOGIN_PATH)
      return
    }
    setTempToken(token)
  }, [router, searchParams])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!tempToken || !verificationId) return

    await handleComplete({
      tempToken,
      phone: phone.replace(/-/g, ''),
      verificationId,
    })
  }

  if (!tempToken) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-body-md text-text-secondary">처리 중...</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-border bg-card-bg p-6 shadow-[0_1px_3px_rgba(0,0,0,.08),0_1px_2px_rgba(0,0,0,.06)]"
    >
      <h2 className="mb-2 text-center text-heading-lg text-text-primary">
        전화번호 인증
      </h2>
      <p className="mb-6 text-center text-body-md text-text-secondary">
        서비스 이용을 위해 전화번호 인증이 필요합니다.
      </p>

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
        disabled={!verificationId}
        className="h-11 w-full text-base"
      >
        가입 완료
      </Button>
    </form>
  )
}
