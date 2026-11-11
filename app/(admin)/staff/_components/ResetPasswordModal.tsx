'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { STAFF_PASSWORD_MIN_LENGTH } from '../_constants'
import { useResetStaffPassword } from '../_hooks/useStaff'
import type { StaffAccount } from '../_types'

type ResetPasswordModalProps = {
  staff: StaffAccount | null
  onClose: () => void
}

export function ResetPasswordModal({ staff, onClose }: ResetPasswordModalProps) {
  const [password, setPassword] = useState('')
  const mutation = useResetStaffPassword()

  useEffect(() => {
    if (staff) setPassword('')
  }, [staff])

  const canSubmit = password.length >= STAFF_PASSWORD_MIN_LENGTH

  const handleSubmit = () => {
    if (!staff || !canSubmit) return
    mutation.mutate({ id: staff.id, password }, { onSuccess: onClose })
  }

  return (
    <Modal
      isOpen={staff !== null}
      onClose={onClose}
      title="비밀번호 재설정"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button loading={mutation.isPending} disabled={!canSubmit} onClick={handleSubmit}>
            변경
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-body-md text-text-secondary">
          <span className="font-semibold text-text-primary">{staff?.email}</span>의 새 비밀번호를
          입력하세요 ({STAFF_PASSWORD_MIN_LENGTH}자 이상).
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          className="text-body-md h-9 w-full rounded-lg border border-border bg-white px-3 text-text-primary focus:border-brand focus:outline-none"
        />
        <p className="text-caption-sm text-text-muted">
          이미 로그인된 기기는 로그인이 유지됩니다. 바로 막아야 하면 계정을 비활성화하세요.
        </p>
      </div>
    </Modal>
  )
}
