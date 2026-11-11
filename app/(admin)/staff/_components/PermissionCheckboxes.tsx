'use client'

import { ADMIN_PERMISSIONS, type AdminPermission } from '@/constants/adminPermissions'

type PermissionCheckboxesProps = {
  value: AdminPermission[]
  onChange: (next: AdminPermission[]) => void
  disabled?: boolean
}

export function PermissionCheckboxes({ value, onChange, disabled }: PermissionCheckboxesProps) {
  const toggle = (key: AdminPermission) => {
    onChange(value.includes(key) ? value.filter((k) => k !== key) : [...value, key])
  }

  const allChecked = value.length === ADMIN_PERMISSIONS.length

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-caption-md font-semibold text-text-secondary">볼 수 있는 페이지</p>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(allChecked ? [] : ADMIN_PERMISSIONS.map((p) => p.key))}
          className="text-caption-sm text-brand hover:underline disabled:opacity-50"
        >
          {allChecked ? '전체 해제' : '전체 선택'}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {ADMIN_PERMISSIONS.map((permission) => (
          <label
            key={permission.key}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 hover:bg-gray-50"
          >
            <input
              type="checkbox"
              className="h-4 w-4 accent-brand"
              checked={value.includes(permission.key)}
              disabled={disabled}
              onChange={() => toggle(permission.key)}
            />
            <span className="text-body-md text-text-primary">{permission.label}</span>
          </label>
        ))}
      </div>
      <p className="text-caption-sm mt-2 text-text-muted">
        설정·직원 관리·주문 삭제는 체크와 상관없이 사장 계정만 사용할 수 있습니다.
      </p>
    </div>
  )
}
