'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useSendPhoneCode } from '../_hooks/useSendPhoneCode'
import { useVerifyPhoneCode } from '../_hooks/useVerifyPhoneCode'

type PhoneVerificationStepProps = {
  phone: string
  onPhoneChange: (phone: string) => void
  onVerified: (verificationId: string) => void
}

function formatCooldown(seconds: number): string {
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${min}:${String(sec).padStart(2, '0')}`
}

export function PhoneVerificationStep({
  phone,
  onPhoneChange,
  onVerified,
}: PhoneVerificationStepProps) {
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const { sendCode, isSending, cooldown } = useSendPhoneCode()
  const { verifyCode, isVerifying, isVerified } = useVerifyPhoneCode()

  const handleSendCode = () => {
    const cleaned = phone.replace(/-/g, '')
    if (!/^010\d{8}$/.test(cleaned)) return

    sendCode(cleaned, {
      onSuccess: () => setCodeSent(true),
    })
  }

  const handleVerify = () => {
    if (code.length !== 6) return

    const cleaned = phone.replace(/-/g, '')
    verifyCode(
      { phone: cleaned, code },
      {
        onSuccess: (result) => {
          onVerified(result.data.verificationId)
        },
      },
    )
  }

  const inputClass = cn(
    'w-full rounded-lg border border-border bg-white px-3 py-2.5',
    'text-body-md text-text-primary placeholder:text-text-muted',
    'outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-light',
  )

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="text-caption-md mb-1.5 block font-semibold text-text-secondary">
          전화번호
        </label>
        <div className="flex gap-2">
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value.replace(/[^\d]/g, ''))}
            placeholder="01012345678"
            maxLength={11}
            disabled={isVerified}
            className={cn(inputClass, 'flex-1', isVerified && 'bg-gray-100')}
          />
          <Button
            type="button"
            variant={isVerified ? 'success' : 'primary'}
            onClick={handleSendCode}
            loading={isSending}
            disabled={isVerified || cooldown > 0 || phone.replace(/-/g, '').length !== 11}
            className="shrink-0"
          >
            {isVerified
              ? '인증완료'
              : cooldown > 0
                ? formatCooldown(cooldown)
                : codeSent
                  ? '재발송'
                  : '인증요청'}
          </Button>
        </div>
      </div>

      {codeSent && !isVerified && (
        <div>
          <label className="text-caption-md mb-1.5 block font-semibold text-text-secondary">
            인증번호
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^\d]/g, '').slice(0, 6))}
              placeholder="6자리 숫자"
              maxLength={6}
              className={cn(inputClass, 'flex-1')}
            />
            <Button
              type="button"
              onClick={handleVerify}
              loading={isVerifying}
              disabled={code.length !== 6}
              className="shrink-0"
            >
              확인
            </Button>
          </div>
          {cooldown > 0 && (
            <p className="mt-1 text-caption-sm text-text-muted">
              남은 시간: {formatCooldown(cooldown)}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
