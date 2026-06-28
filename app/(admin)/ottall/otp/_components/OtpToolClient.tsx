'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { isValidSecret, TOTP_PERIOD } from '@/lib/totp'
import { useTotp } from '../_hooks/useTotp'

const RING_RADIUS = 26
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

export function OtpToolClient() {
  const [secret, setSecret] = useState('')
  const [submitted, setSubmitted] = useState('')
  const { code, remaining } = useTotp(submitted)

  const inputValid = secret.trim() !== '' && isValidSecret(secret)
  const showInvalid = secret.trim() !== '' && !inputValid
  const hasCode = submitted !== '' && code !== ''
  const isLow = remaining <= 5

  const handleChange = (value: string) => {
    setSecret(value)
    setSubmitted('') // 시크릿을 수정하면 이전 발급 코드는 숨김 → 다시 발급 필요
  }

  const handleGenerate = () => {
    if (!inputValid) return
    setSubmitted(secret)
  }

  const handleCopy = async () => {
    if (!code) return
    try {
      await navigator.clipboard.writeText(code)
      toast.success('코드 복사됨')
    } catch {
      toast.error('복사에 실패했습니다. (보안 컨텍스트 필요)')
    }
  }

  const ringOffset = RING_CIRCUMFERENCE * (1 - remaining / TOTP_PERIOD)

  return (
    <div className="mx-auto max-w-md space-y-4">
      <Card>
        <CardHeader>
          <h1 className="text-heading-md text-text-primary">OTP 발급</h1>
        </CardHeader>
        <CardBody className="space-y-3">
          <div className="space-y-2">
            <label htmlFor="otp-secret" className="text-caption-md block text-text-secondary">
              시크릿 키 (Base32)
            </label>
            <input
              id="otp-secret"
              value={secret}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleGenerate()
              }}
              placeholder="Base32 시크릿 키 붙여넣기"
              autoComplete="off"
              spellCheck={false}
              className={cn(
                'w-full rounded-lg border bg-white px-3 py-2',
                'text-body-md text-text-primary placeholder:text-text-muted',
                'font-mono outline-none transition-colors focus:ring-2 focus:ring-brand-light',
                showInvalid ? 'border-danger focus:border-danger' : 'border-border focus:border-brand',
              )}
            />
            {showInvalid ? (
              <p className="text-caption-md text-danger">
                유효하지 않은 시크릿 키입니다 (Base32 형식 확인)
              </p>
            ) : (
              <p className="text-caption-md text-text-muted">공백이 있어도 자동으로 정리됩니다.</p>
            )}
          </div>

          <Button
            variant="primary"
            onClick={handleGenerate}
            disabled={!inputValid}
            className="w-full"
          >
            발급하기
          </Button>
        </CardBody>
      </Card>

      {hasCode && (
        <Card>
          <CardBody className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleCopy}
              className="group flex flex-col items-start gap-0.5 text-left"
              title="클릭하여 복사"
            >
              <span className="text-display font-mono tracking-widest text-text-primary tabular-nums group-hover:text-brand">
                {code.slice(0, 3)} {code.slice(3)}
              </span>
              <span className="text-caption-md text-text-muted">클릭하여 복사</span>
            </button>

            <div className="relative h-16 w-16">
              <svg className="h-16 w-16 -rotate-90" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r={RING_RADIUS} fill="none" strokeWidth="4" className="stroke-gray-200" />
                <circle
                  cx="30"
                  cy="30"
                  r={RING_RADIUS}
                  fill="none"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={RING_CIRCUMFERENCE}
                  strokeDashoffset={ringOffset}
                  className={cn('transition-[stroke-dashoffset] duration-1000 ease-linear', isLow ? 'stroke-danger' : 'stroke-brand')}
                />
              </svg>
              <span
                className={cn(
                  'text-body-md absolute inset-0 flex items-center justify-center font-semibold tabular-nums',
                  isLow ? 'text-danger' : 'text-text-primary',
                )}
              >
                {remaining}
              </span>
            </div>
          </CardBody>
          <div className="border-t border-border px-5 py-3">
            <Button variant="primary" size="sm" onClick={handleCopy} className="w-full">
              📋 코드 복사
            </Button>
          </div>
        </Card>
      )}

      <ul className="text-caption-md space-y-1 px-1 text-text-muted">
        <li>· 시크릿은 어디에도 저장되지 않으며 새로고침하면 사라집니다.</li>
        <li>· 기기 시계가 정확해야 코드가 일치합니다.</li>
        <li>· 코드만 표시되며 시크릿은 서버로 전송되지 않습니다.</li>
      </ul>
    </div>
  )
}
