'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import type { AdminPartyDetail, PartyType, PartyDurationMode } from '@/types/domain'
import { useUpdateAdminParty } from '../_hooks/useUpdateAdminParty'
import type { UpdateAdminPartyInput } from '../_hooks/useUpdateAdminParty'
import { ImageSelector } from './ImageSelector'
import { RuleTemplateSelect } from './RuleTemplateSelect'
import { isAutoAssignablePartyName } from '@/constants/ottImages'
import { PARTY_TYPE_META, PARTY_DURATION_MODE_META } from '@/constants/app'
import { cn } from '@/lib/utils'

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
  partyType: PartyType
  durationMode: PartyDurationMode
  imagePath: string | null
  notes: string
}

function buildInitial(party: AdminPartyDetail): FormState {
  return {
    name: party.name,
    leaderName: party.leaderName,
    durationDays: String(party.durationDays),
    price: String(party.price),
    dailyDiscount: String(party.dailyDiscount),
    totalSlots: String(party.totalSlots),
    partyType: party.partyType,
    durationMode: party.durationMode,
    imagePath: party.imagePath,
    notes: party.notes ?? '',
  }
}

export function PartyEditForm({ party, onCancel, onSuccess }: PartyEditFormProps) {
  const updateMutation = useUpdateAdminParty()

  const [form, setForm] = useState<FormState>(() => buildInitial(party))

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

    if (trimmedName !== party.name) dirty.name = trimmedName
    if (trimmedLeader !== party.leaderName) dirty.leaderName = trimmedLeader
    if (durationDays !== party.durationDays) dirty.durationDays = durationDays
    if (price !== party.price) dirty.price = price
    if (dailyDiscount !== party.dailyDiscount) dirty.dailyDiscount = dailyDiscount
    if (totalSlots !== party.totalSlots) dirty.totalSlots = totalSlots
    if (form.partyType !== party.partyType) dirty.partyType = form.partyType
    if (form.durationMode !== party.durationMode) dirty.durationMode = form.durationMode
    if (form.imagePath !== party.imagePath) dirty.imagePath = form.imagePath
    if (trimmedNotes !== (party.notes ?? '')) dirty.notes = trimmedNotes || null

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <span className="text-caption-md font-medium text-text-secondary">파티 이미지</span>
        <ImageSelector value={form.imagePath} onChange={handleImageSelect} />
      </div>

      <div className="space-y-1">
        <Field label="파티명" required>
          <input
            type="text"
            value={form.name}
            onChange={updateField('name')}
            maxLength={255}
            className={INPUT_CLASS}
          />
        </Field>
        {/* 이름이 이미지 라벨에서 벗어나면 승인 시 계정 자동 배정이 조용히 멈춘다.
            저장을 막지는 않는다 — 자동배정을 안 쓰는 파티도 있을 수 있다.
            Field는 전체를 <label>로 감싸므로, 이 경고는 바깥에 둬야 라벨 텍스트에 섞이지 않는다. */}
        {form.name.trim() !== '' && !isAutoAssignablePartyName(form.name) && (
          <p role="alert" className="text-caption-md text-warning">
            ⚠ 이 이름으로는 <strong>계정 자동 배정이 되지 않습니다.</strong> 위 이미지를 다시 선택하면
            이름이 원래대로 맞춰집니다. (자동 배정을 쓰지 않는 파티라면 그대로 두셔도 됩니다)
          </p>
        )}
      </div>

      <Field label="파티장 이름" required>
        <input
          type="text"
          value={form.leaderName}
          onChange={updateField('leaderName')}
          maxLength={100}
          className={INPUT_CLASS}
        />
      </Field>

      <Field label="파티 타입" required>
        <select
          value={form.partyType}
          onChange={(e) => {
            const value = e.target.value
            if (value === 'personal' || value === 'shared') {
              setForm((prev) => ({ ...prev, partyType: value }))
            }
          }}
          className={INPUT_CLASS}
        >
          <option value="shared">{PARTY_TYPE_META.shared.label}</option>
          <option value="personal">{PARTY_TYPE_META.personal.label}</option>
        </select>
      </Field>

      <Field label="기간 방식" required>
        <div className="flex gap-2">
          {(['countdown', 'fixed'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, durationMode: mode }))}
              className={cn(
                'flex-1 rounded-full px-4 py-2 text-body-md font-medium transition-colors',
                form.durationMode === mode
                  ? 'bg-brand text-white'
                  : 'bg-gray-100 text-text-secondary hover:bg-gray-200',
              )}
            >
              {PARTY_DURATION_MODE_META[mode].label}
            </button>
          ))}
        </div>
        <span className="block text-caption-sm text-text-muted">
          {PARTY_DURATION_MODE_META[form.durationMode].description}
        </span>
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
        <RuleTemplateSelect
          currentValue={form.notes}
          onApply={(content) => setForm((prev) => ({ ...prev, notes: content }))}
        />
        <textarea
          value={form.notes}
          onChange={updateField('notes')}
          rows={4}
          className={INPUT_CLASS}
        />
      </Field>

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
