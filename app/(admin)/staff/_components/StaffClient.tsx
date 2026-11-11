'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { ADMIN_PERMISSIONS } from '@/constants/adminPermissions'
import { formatDateOnly } from '@/lib/utils'
import { useDeleteStaff, useStaffList, useUpdateStaff } from '../_hooks/useStaff'
import type { StaffAccount } from '../_types'
import { ResetPasswordModal } from './ResetPasswordModal'
import { StaffFormModal } from './StaffFormModal'

function permissionLabels(staff: StaffAccount): string[] {
  return ADMIN_PERMISSIONS.filter((p) => staff.permissions.includes(p.key)).map((p) => p.label)
}

export function StaffClient() {
  const { data: staffList, isLoading, isError } = useStaffList()
  const updateMutation = useUpdateStaff()
  const deleteMutation = useDeleteStaff()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<StaffAccount | null>(null)
  const [resetting, setResetting] = useState<StaffAccount | null>(null)

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (staff: StaffAccount) => {
    setEditing(staff)
    setFormOpen(true)
  }

  const toggleActive = (staff: StaffAccount) => {
    const message = staff.isActive
      ? `${staff.email} 계정을 비활성화할까요?\n다음 클릭부터 바로 막히고 다시 로그인할 수 없습니다.`
      : `${staff.email} 계정을 다시 활성화할까요?`
    if (!window.confirm(message)) return
    updateMutation.mutate({ id: staff.id, isActive: !staff.isActive })
  }

  const remove = (staff: StaffAccount) => {
    if (!window.confirm(`${staff.email} 계정을 삭제할까요?\n되돌릴 수 없습니다.`)) return
    deleteMutation.mutate(staff.id)
  }

  return (
    <section className="mx-auto max-w-4xl space-y-4">
      <Card>
        <CardHeader>
          <div>
            <h2 className="text-heading-sm text-text-primary">직원 계정</h2>
            <p className="text-caption-md mt-0.5 text-text-muted">
              직원은 체크한 페이지만 볼 수 있습니다. 권한 변경·비활성화는 저장 즉시 적용됩니다.
            </p>
          </div>
          <Button onClick={openCreate}>직원 추가</Button>
        </CardHeader>

        {isLoading && (
          <p className="text-body-md px-5 py-8 text-center text-text-muted">불러오는 중...</p>
        )}
        {isError && (
          <p className="text-body-md px-5 py-8 text-center text-danger">목록을 불러오지 못했습니다.</p>
        )}
        {staffList && staffList.length === 0 && (
          <p className="text-body-md px-5 py-8 text-center text-text-muted">
            아직 직원 계정이 없습니다. &lsquo;직원 추가&rsquo;로 만들어 주세요.
          </p>
        )}

        {staffList && staffList.length > 0 && (
          <ul className="divide-y divide-border">
            {staffList.map((staff) => {
              const labels = permissionLabels(staff)
              return (
                <li
                  key={staff.id}
                  className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-start"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-body-md truncate font-semibold text-text-primary">
                        {staff.email}
                      </span>
                      {staff.isActive ? (
                        <Badge variant="green">사용 중</Badge>
                      ) : (
                        <Badge variant="gray">비활성</Badge>
                      )}
                      <span className="text-caption-sm text-text-muted">
                        {formatDateOnly(staff.createdAt)} 생성
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {labels.length === 0 ? (
                        <span className="text-caption-md text-text-muted">
                          볼 수 있는 페이지 없음
                        </span>
                      ) : (
                        labels.map((label) => (
                          <Badge key={label} variant="blue">
                            {label}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 md:justify-end">
                    <Button size="sm" variant="secondary" onClick={() => openEdit(staff)}>
                      권한 수정
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setResetting(staff)}>
                      비밀번호
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={updateMutation.isPending}
                      onClick={() => toggleActive(staff)}
                    >
                      {staff.isActive ? '비활성화' : '활성화'}
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={deleteMutation.isPending}
                      onClick={() => remove(staff)}
                    >
                      삭제
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </Card>

      <StaffFormModal isOpen={formOpen} staff={editing} onClose={() => setFormOpen(false)} />
      <ResetPasswordModal staff={resetting} onClose={() => setResetting(null)} />
    </section>
  )
}
