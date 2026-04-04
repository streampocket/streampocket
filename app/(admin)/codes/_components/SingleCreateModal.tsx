'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useBulkCreateAccounts } from '../_hooks/useBulkCreateAccounts'
import { useProducts } from '../../products/_hooks/useProducts'

type SingleCreateModalProps = {
  onClose: () => void
}

type SingleCreateForm = {
  productId: string
  username: string
  password: string
  email: string
  emailPassword: string
  emailSiteUrl: string
  secondaryEmail: string
  secondaryEmailPassword: string
  secondaryEmailSiteUrl: string
}

const initialForm: SingleCreateForm = {
  productId: '',
  username: '',
  password: '',
  email: '',
  emailPassword: '',
  emailSiteUrl: '',
  secondaryEmail: '',
  secondaryEmailPassword: '',
  secondaryEmailSiteUrl: '',
}

const inputClass = cn(
  'w-full rounded-lg border border-border bg-white px-3 py-2',
  'text-body-md text-text-primary placeholder:text-text-muted',
  'outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-light',
)

export function SingleCreateModal({ onClose }: SingleCreateModalProps) {
  const [form, setForm] = useState<SingleCreateForm>(initialForm)

  const { data: productsData } = useProducts({ status: 'active' })
  const { mutate: bulkCreate, isPending } = useBulkCreateAccounts()

  const naProducts = productsData?.data.filter((p) => !/ AA$/i.test(p.name.trim())) ?? []

  const isValid =
    form.productId &&
    form.username &&
    form.password &&
    form.email &&
    form.emailPassword &&
    form.emailSiteUrl

  const handleSubmit = () => {
    if (!isValid) return
    bulkCreate(
      {
        productId: form.productId,
        accounts: [
          {
            username: form.username,
            password: form.password,
            email: form.email,
            emailPassword: form.emailPassword,
            emailSiteUrl: form.emailSiteUrl,
            ...(form.secondaryEmail ? { secondaryEmail: form.secondaryEmail } : {}),
            ...(form.secondaryEmailPassword
              ? { secondaryEmailPassword: form.secondaryEmailPassword }
              : {}),
            ...(form.secondaryEmailSiteUrl
              ? { secondaryEmailSiteUrl: form.secondaryEmailSiteUrl }
              : {}),
          },
        ],
      },
      { onSuccess: onClose },
    )
  }

  const setField = <K extends keyof SingleCreateForm>(key: K, value: SingleCreateForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="계정 단건 등록"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isPending}>
            취소
          </Button>
          <Button loading={isPending} disabled={!isValid} onClick={handleSubmit}>
            등록
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-caption-md font-semibold text-text-secondary">
            상품 선택 <span className="text-danger">*</span>
          </label>
          <select
            value={form.productId}
            onChange={(e) => setField('productId', e.target.value)}
            className={cn(
              'w-full rounded-lg border border-border bg-white px-3 py-2',
              'text-body-md text-text-primary outline-none focus:border-brand',
            )}
          >
            <option value="">상품을 선택하세요</option>
            {naProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-caption-md font-semibold text-text-secondary">
              아이디 <span className="text-danger">*</span>
            </label>
            <input
              className={inputClass}
              value={form.username}
              onChange={(e) => setField('username', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-caption-md font-semibold text-text-secondary">
              비밀번호 <span className="text-danger">*</span>
            </label>
            <input
              className={inputClass}
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-caption-md font-semibold text-text-secondary">
              이메일 <span className="text-danger">*</span>
            </label>
            <input
              className={inputClass}
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-caption-md font-semibold text-text-secondary">
              이메일 비밀번호 <span className="text-danger">*</span>
            </label>
            <input
              className={inputClass}
              value={form.emailPassword}
              onChange={(e) => setField('emailPassword', e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-caption-md font-semibold text-text-secondary">
            이메일 사이트 URL <span className="text-danger">*</span>
          </label>
          <input
            className={inputClass}
            value={form.emailSiteUrl}
            onChange={(e) => setField('emailSiteUrl', e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-caption-md font-semibold text-text-secondary">
              2차 이메일 <span className="text-text-muted">(선택)</span>
            </label>
            <input
              className={inputClass}
              value={form.secondaryEmail}
              onChange={(e) => setField('secondaryEmail', e.target.value)}
              placeholder="없으면 비워두세요"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-caption-md font-semibold text-text-secondary">
              2차 이메일 비밀번호 <span className="text-text-muted">(선택)</span>
            </label>
            <input
              className={inputClass}
              value={form.secondaryEmailPassword}
              onChange={(e) => setField('secondaryEmailPassword', e.target.value)}
              placeholder="없으면 비워두세요"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-caption-md font-semibold text-text-secondary">
            2차 이메일 플랫폼 <span className="text-text-muted">(선택)</span>
          </label>
          <input
            className={inputClass}
            value={form.secondaryEmailSiteUrl}
            onChange={(e) => setField('secondaryEmailSiteUrl', e.target.value)}
            placeholder="없으면 비워두세요"
          />
        </div>
      </div>
    </Modal>
  )
}
