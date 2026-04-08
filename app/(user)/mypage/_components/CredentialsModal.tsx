'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useApplicationCredentials } from '../_hooks/useApplicationCredentials'

type CredentialsModalProps = {
  applicationId: string | null
  productName: string
  isOpen: boolean
  onClose: () => void
}

export function CredentialsModal({
  applicationId,
  productName,
  isOpen,
  onClose,
}: CredentialsModalProps) {
  const { data: credentials, isLoading, error } = useApplicationCredentials(
    isOpen ? applicationId : null,
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="계정 정보"
      className="max-w-md"
      footer={
        <Button variant="secondary" onClick={onClose}>
          닫기
        </Button>
      }
    >
      <div className="space-y-4">
        <p className="text-body-md font-semibold text-text-primary">{productName}</p>

        {isLoading && (
          <div className="flex items-center justify-center py-6">
            <p className="text-body-md text-text-muted">계정 정보를 불러오는 중...</p>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-4">
            <p className="text-body-sm text-red-600">계정 정보를 불러올 수 없습니다.</p>
          </div>
        )}

        {credentials && (
          <div className="space-y-3">
            <CredentialField label="계정 ID" value={credentials.accountId} />
            <CredentialField label="비밀번호" value={credentials.accountPassword} />
          </div>
        )}
      </div>
    </Modal>
  )
}

type CredentialFieldProps = {
  label: string
  value: string | null
}

function CredentialField({ label, value }: CredentialFieldProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!value) return
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg border border-border bg-gray-50 p-3">
      <p className="text-caption-md mb-1 font-semibold text-text-muted">{label}</p>
      {value ? (
        <div className="flex items-center justify-between gap-2">
          <p className="break-all text-body-md text-text-primary">{value}</p>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 rounded-lg px-2 py-1 text-caption-md font-medium text-brand transition-colors hover:bg-brand/10"
          >
            {copied ? '복사됨' : '복사'}
          </button>
        </div>
      ) : (
        <p className="text-body-md text-text-muted">등록된 정보가 없습니다.</p>
      )}
    </div>
  )
}
