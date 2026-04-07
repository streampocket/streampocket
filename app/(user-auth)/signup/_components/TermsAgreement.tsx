'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

type TermsAgreementProps = {
  serviceAgreed: boolean
  privacyAgreed: boolean
  onServiceChange: (checked: boolean) => void
  onPrivacyChange: (checked: boolean) => void
}

export function TermsAgreement({
  serviceAgreed,
  privacyAgreed,
  onServiceChange,
  onPrivacyChange,
}: TermsAgreementProps) {
  const allAgreed = serviceAgreed && privacyAgreed

  const handleAllChange = () => {
    const next = !allAgreed
    onServiceChange(next)
    onPrivacyChange(next)
  }

  return (
    <div className="rounded-lg border border-border bg-gray-50 p-4">
      {/* 전체 동의 */}
      <label className="flex cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          checked={allAgreed}
          onChange={handleAllChange}
          className="sr-only"
        />
        <span
          className={cn(
            'flex h-5 w-5 shrink-0 items-center justify-center rounded',
            'border transition-colors',
            allAgreed
              ? 'border-brand bg-brand text-white'
              : 'border-gray-300 bg-white',
          )}
        >
          {allAgreed && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <span className="text-body-md font-semibold text-text-primary">전체 동의</span>
      </label>

      <hr className="my-3 border-border" />

      {/* 서비스 이용약관 */}
      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={serviceAgreed}
            onChange={(e) => onServiceChange(e.target.checked)}
            className="sr-only"
          />
          <span
            className={cn(
              'flex h-5 w-5 shrink-0 items-center justify-center rounded',
              'border transition-colors',
              serviceAgreed
                ? 'border-brand bg-brand text-white'
                : 'border-gray-300 bg-white',
            )}
          >
            {serviceAgreed && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span className="text-caption-md text-text-secondary">
            <span className="font-semibold text-red-500">[필수]</span>{' '}
            서비스 이용약관 동의
          </span>
        </label>
        <Link
          href="/terms/signup"
          target="_blank"
          className="text-caption-sm text-text-muted underline hover:text-text-secondary"
        >
          보기
        </Link>
      </div>

      {/* 개인정보 처리방침 */}
      <div className="mt-2.5 flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={privacyAgreed}
            onChange={(e) => onPrivacyChange(e.target.checked)}
            className="sr-only"
          />
          <span
            className={cn(
              'flex h-5 w-5 shrink-0 items-center justify-center rounded',
              'border transition-colors',
              privacyAgreed
                ? 'border-brand bg-brand text-white'
                : 'border-gray-300 bg-white',
            )}
          >
            {privacyAgreed && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span className="text-caption-md text-text-secondary">
            <span className="font-semibold text-red-500">[필수]</span>{' '}
            개인정보 처리방침 동의
          </span>
        </label>
        <Link
          href="/privacy"
          target="_blank"
          className="text-caption-sm text-text-muted underline hover:text-text-secondary"
        >
          보기
        </Link>
      </div>
    </div>
  )
}
