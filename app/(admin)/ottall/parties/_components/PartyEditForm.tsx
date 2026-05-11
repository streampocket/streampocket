'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import type { AdminPartyDetail } from '@/types/domain'
import { useAdminPartyCredentials } from '../_hooks/useAdminPartyCredentials'
import { useUpdateAdminParty } from '../_hooks/useUpdateAdminParty'
import type { UpdateAdminPartyInput } from '../_hooks/useUpdateAdminParty'
import { ImageSelector } from './ImageSelector'

type PartyEditFormProps = {
  party: AdminPartyDetail
  onCancel: () => void
  onSuccess: () => void
}

type FormState = {
  name: string
  leaderName: string
  durationDays: string
  price: string
  dailyDiscount: string
  totalSlots: string
  imagePath: string | null
  notes: string
  accountId: string
  accountPassword: string
}

function buildInitial(party: AdminPartyDetail, accountId: string, accountPassword: string): FormState {
  return {
    name: party.name,
    leaderName: party.leaderName,
    durationDays: String(party.durationDays),
    price: String(party.price),
    dailyDiscount: String(party.dailyDiscount),
    totalSlots: String(party.totalSlots),
    imagePath: party.imagePath,
    notes: party.notes ?? '',
    accountId,
    accountPassword,
  }
}

export function PartyEditForm({ party, onCancel, onSuccess }: PartyEditFormProps) {
  const { data: credentials, isLoading: credLoading } = useAdminPartyCredentials(party.id, true)
  const updateMutation = useUpdateAdminParty()
  const [showPassword, setShowPassword] = useState(false)

  const [form, setForm] = useState<FormState>(() => buildInitial(party, '', ''))
  const [didInit, setDidInit] = useState(false)

  useEffect(() => {
    if (didInit) return
    if (credLoading) return
    setForm(buildInitial(party, credentials?.accountId ?? '', credentials?.accountPassword ?? ''))
    setDidInit(true)
  }, [didInit, credLoading, credentials, party])

  const updateField =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
    }

  const handleImageSelect = (path: string | null, label: string) => {
    setForm((prev) => ({
      ...prev,
      imagePath: path,
      name: path ? label : prev.name,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name.trim()) return toast.error('파티명을 입력해 주세요.')
    if (!form.leaderName.trim()) return toast.error('파티장 이름을 입력해 주세요.')

    const durationDays = Number(form.durationDays)
    const price = Number(form.price)
    const dailyDiscount = Number(form.dailyDiscount)
    const totalSlots = Number(form.totalSlots)

    if (!Number.isInteger(durationDays) || durationDays <= 0)
      return toast.error('이용기간을 올바르게 입력해 주세요.')
    if (!Number.isInteger(price) || price <= 0)
      return toast.error('가격을 올바르게 입력해 주세요.')
    if (!Number.isInteger(dailyDiscount) || dailyDiscount < 0)
      return toast.error('하루 할인 금액을 올바르게 입력해 주세요.')
    if (!Number.isInteger(totalSlots) || totalSlots < 1)
      return toast.error('모집 인원을 올바르게 입력해 주세요.')

    const dirty: UpdateAdminPartyInput = {}
    const trimmedName = form.name.trim()
    const trimmedLeader = form.leaderName.trim()
    const trimmedNotes = form.notes.trim()
    const trimmedAccountId = form.accountId.trim()
    const trimmedPassword = form.accountPassword.trim()

    if (trimmedName !== party.name) dirty.name = trimmedName
    if (trimmedLeader !== party.leaderName) dirty.leaderName = trimmedLeader
    if (durationDays !== party.durationDays) dirty.durationDays = durationDays
    if (price !== party.price) dirty.price = price
    if (dailyDiscount !== party.dailyDiscount) dirty.dailyDiscount = dailyDiscount
    if (totalSlots !== party.totalSlots) dirty.totalSlots = totalSlots
    if (form.imagePath !== party.imagePath) dirty.imagePath = form.imagePath
    if (trimmedNotes !== (party.notes ?? '')) dirty.notes = trimmedNotes || null
    if (trimmedAccountId !== (credentials?.accountId ?? ''))
      dirty.accountId = trimmedAccountId || null
    if (trimmedPassword !== (credentials?.accountPassword ?? ''))
      dirty.accountPassword = trimmedPassword || null

    if (Object.keys(dirty).length === 0) {
      toast.info('변경된 내용이 없습니다.')
      return
    }

    updateMutation.mutate(
      { id: party.id, input: dirty },
      {
        onSuccess: () => {
          toast.success('파티가 수정되었습니다.')
          onSuccess()
        },
        onError: (err: Error) => {
          toast.error(err.message ?? '파티 수정에 실패했습니다.')
        },
      },
    )
  }

  if (credLoading && !didInit) {
    return (
      <div className="py-10 text-center">
        <p className="text-body-md text-text-muted">계정 정보 로딩 중...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <span className="text-caption-md font-medium text-text-secondary">파티 이미지</span>
        <ImageSelector value={form.imagePath} onChange={handleImageSelect} />
      </div>

      <Field label="파티명" required>
        <input
          type="text"
          value={form.name}
          onChange={updateField('name')}
          maxLength={255}
          className={INPUT_CLASS}
        />
      </Field>

      <Field label="파티장 이름" required>
        <input
          type="text"
          value={form.leaderName}
          onChange={updateField('leaderName')}
          maxLength={100}
          className={INPUT_CLASS}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="이용기간(일)" required>
          <input
            type="number"
            min={1}
            value={form.durationDays}
            onChange={updateField('durationDays')}
            className={INPUT_CLASS}
          />
        </Field>
        <Field
          label="모집 인원"
          required
          hint={`현재 ${party.filledSlots}명 채움 — 그 이하로는 줄일 수 없습니다.`}
        >
          <input
            type="number"
            min={1}
            value={form.totalSlots}
            onChange={updateField('totalSlots')}
            className={INPUT_CLASS}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="가격(원)" required>
          <input
            type="number"
            min={1}
            value={form.price}
            onChange={updateField('price')}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="하루 할인(원)">
          <input
            type="number"
            min={0}
            value={form.dailyDiscount}
            onChange={updateField('dailyDiscount')}
            className={INPUT_CLASS}
          />
        </Field>
      </div>

      <Field label="파티 규칙/메모">
        <textarea
          value={form.notes}
          onChange={updateField('notes')}
          rows={4}
          className={INPUT_CLASS}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="계정 ID">
          <input
            type="text"
            value={form.accountId}
            onChange={updateField('accountId')}
            autoComplete="off"
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="계정 비밀번호">
          <div className="flex gap-2">
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.accountPassword}
              onChange={updateField('accountPassword')}
              autoComplete="off"
              className={INPUT_CLASS}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? '숨김' : '보기'}
            </Button>
          </div>
        </Field>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={updateMutation.isPending}
        >
          취소
        </Button>
        <Button type="submit" variant="primary" loading={updateMutation.isPending}>
          저장
        </Button>
      </div>
    </form>
  )
}

const INPUT_CLASS =
  'text-body-md w-full rounded-lg border border-border bg-card-bg px-3 py-2 text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none'

type FieldProps = {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}

function Field({ label, required, hint, children }: FieldProps) {
  return (
    <label className="block space-y-1">
      <span className="text-caption-md font-medium text-text-secondary">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      {children}
      {hint && <span className="block text-caption-sm text-text-muted">{hint}</span>}
    </label>
  )
}
