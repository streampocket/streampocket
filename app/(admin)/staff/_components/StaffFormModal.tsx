'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { isAdminPermission, type AdminPermission } from '@/constants/adminPermissions'
import { cn } from '@/lib/utils'
import { STAFF_PASSWORD_MIN_LENGTH } from '../_constants'
import { useCreateStaff, useUpdateStaff } from '../_hooks/useStaff'
import type { StaffAccount } from '../_types'
import { PermissionCheckboxes } from './PermissionCheckboxes'

type StaffFormModalProps = {
  isOpen: boolean
  /** null이면 새 계정 만들기, 있으면 그 계정의 권한 수정 */
  staff: StaffAccount | null
  onClose: () => void
}

const INPUT_CLASS =
  'text-body-md h-9 w-full rounded-lg border border-border bg-white px-3 text-text-primary focus:border-brand focus:outline-none'

export function StaffFormModal({ isOpen, staff, onClose }: StaffFormModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [permissions, setPermissions] = useState<AdminPermission[]>([])
  const createMutation = useCreateStaff()
  const updateMutation = useUpdateStaff()
  const isPending = createMutation.isPending || updateMutation.isPending

  // 열 때마다 대상 계정 값으로 초기화 (닫았다 다시 열면 이전 입력이 남지 않게)
  useEffect(() => {
    if (!isOpen) return
    setEmail('')
    setPassword('')
    // 서버에 예전 키가 남아 있어도 화면에 없는 권한은 버린다
    setPermissions(staff ? staff.permissions.filter(isAdminPermission) : [])
  }, [isOpen, staff])

  const passwordTooShort = password.length > 0 && password.length < STAFF_PASSWORD_MIN_LENGTH
  const canSubmit =
    staff !== null || (email.trim() !== '' && password.length >= STAFF_PASSWORD_MIN_LENGTH)

  const handleSubmit = () => {
    if (!canSubmit) return
    if (staff) {
      updateMutation.mutate({ id: staff.id, permissions }, { onSuccess: onClose })
      return
    }
    createMutation.mutate({ email: email.trim(), password, permissions }, { onSuccess: onClose })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={staff ? '페이지 권한 수정' : '직원 계정 만들기'}
      className="max-w-xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button loading={isPending} disabled={!canSubmit} onClick={handleSubmit}>
            {staff ? '저장' : '만들기'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {staff ? (
          <p className="text-body-md text-text-secondary">
            <span className="font-semibold text-text-primary">{staff.email}</span> 계정이 볼 수 있는
            페이지를 고르세요. 저장하면 직원의 다음 클릭부터 바로 적용됩니다.
          </p>
        ) : (
          <>
            <div>
              <label className="text-caption-md mb-1.5 block font-semibold text-text-secondary">
                로그인 이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@example.com"
                autoComplete="off"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className="text-caption-md mb-1.5 block font-semibold text-text-secondary">
                비밀번호 ({STAFF_PASSWORD_MIN_LENGTH}자 이상)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className={cn(INPUT_CLASS, passwordTooShort && 'border-danger')}
              />
              {passwordTooShort && (
                <p className="text-caption-sm mt-1 text-danger">
                  비밀번호는 {STAFF_PASSWORD_MIN_LENGTH}자 이상이어야 합니다.
                </p>
              )}
            </div>
          </>
        )}
        <PermissionCheckboxes value={permissions} onChange={setPermissions} disabled={isPending} />
      </div>
    </Modal>
  )
}
