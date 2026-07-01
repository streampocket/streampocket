'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { useCreateAdminParty } from '../_hooks/useCreateAdminParty'
import { ImageSelector } from './ImageSelector'
import type { PartyType } from '@/types/domain'
import { PARTY_TYPE_META } from '@/constants/app'

type PartyCreateModalProps = {
  isOpen: boolean
  onClose: () => void
}

type FormState = {
  name: string
  leaderName: string
  durationDays: string
  price: string
  dailyDiscount: string
  totalSlots: string
  partyType: PartyType
  imagePath: string | null
  notes: string
  accountId: string
  accountPassword: string
}

const INITIAL_FORM: FormState = {
  name: '',
  leaderName: '',
  durationDays: '30',
  price: '',
  dailyDiscount: '0',
  totalSlots: '4',
  partyType: 'shared',
  imagePath: null,
  notes: '',
  accountId: '',
  accountPassword: '',
}

export function PartyCreateModal({ isOpen, onClose }: PartyCreateModalProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const createMutation = useCreateAdminParty()

  const updateField = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  const handleImageSelect = (path: string | null, label: string) => {
    setForm((prev) => ({
      ...prev,
      imagePath: path,
      name: path ? label : '',
    }))
  }

  const reset = () => setForm(INITIAL_FORM)

  const handleClose = () => {
    if (createMutation.isPending) return
    reset()
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.imagePath || !form.name.trim()) return toast.error('파티를 선택해 주세요.')
    if (!form.leaderName.trim()) return toast.error('파티장 이름을 입력해 주세요.')

    const durationDays = Number(form.durationDays)
    const price = Number(form.price)
    const dailyDiscount = Number(form.dailyDiscount)
    const totalSlots = Number(form.totalSlots)

    if (!Number.isInteger(durationDays) || durationDays <= 0) return toast.error('이용기간을 올바르게 입력해 주세요.')
    if (!Number.isInteger(price) || price <= 0) return toast.error('가격을 올바르게 입력해 주세요.')
    if (!Number.isInteger(dailyDiscount) || dailyDiscount < 0) return toast.error('하루 할인 금액을 올바르게 입력해 주세요.')
    if (!Number.isInteger(totalSlots) || totalSlots < 1) return toast.error('모집 인원을 올바르게 입력해 주세요.')

    createMutation.mutate(
      {
        name: form.name.trim(),
        leaderName: form.leaderName.trim(),
        durationDays,
        price,
        dailyDiscount,
        totalSlots,
        partyType: form.partyType,
        imagePath: form.imagePath,
        notes: form.notes.trim() || null,
        accountId: form.accountId.trim() || null,
        accountPassword: form.accountPassword.trim() || null,
      },
      {
        onSuccess: () => {
          toast.success('파티가 생성되었습니다.')
          reset()
          onClose()
        },
        onError: (err: Error) => {
          toast.error(err.message ?? '파티 생성에 실패했습니다.')
        },
      },
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="파티 생성하기"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={handleClose} disabled={createMutation.isPending}>
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={createMutation.isPending}
          >
            생성
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <span className="text-caption-md font-medium text-text-secondary">
            파티 선택<span className="ml-0.5 text-red-500">*</span>
          </span>
          <ImageSelector value={form.imagePath} onChange={handleImageSelect} />
          {!form.imagePath ? (
            <p className="text-caption-sm text-text-muted">파티를 선택해주세요.</p>
          ) : (
            <p className="text-caption-sm font-medium text-brand-dark">선택된 파티: {form.name}</p>
          )}
        </div>

        <Field label="파티장 이름" required hint="화면에 표시될 파티장 이름을 직접 입력합니다.">
          <input
            type="text"
            value={form.leaderName}
            onChange={updateField('leaderName')}
            placeholder="예: 홍길동"
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
          <Field label="모집 인원" required>
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
              placeholder="예: 4500"
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

        <Field label="파티 규칙/메모(선택)">
          <textarea
            value={form.notes}
            onChange={updateField('notes')}
            rows={4}
            className={INPUT_CLASS}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="계정 ID(선택)">
            <input
              type="text"
              value={form.accountId}
              onChange={updateField('accountId')}
              autoComplete="off"
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="계정 비밀번호(선택)">
            <input
              type="text"
              value={form.accountPassword}
              onChange={updateField('accountPassword')}
              autoComplete="off"
              className={INPUT_CLASS}
            />
          </Field>
        </div>
      </form>
    </Modal>
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
