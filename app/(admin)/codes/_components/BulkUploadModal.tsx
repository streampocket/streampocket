'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useBulkCreateAccounts } from '../_hooks/useBulkCreateAccounts'
import { useProducts } from '../../products/_hooks/useProducts'

type BulkUploadModalProps = {
  onClose: () => void
}

function parseAccountLines(raw: string): Array<{
  username: string
  password: string
  email: string
  emailPassword: string
  emailSiteUrl: string
  secondaryEmail?: string
  secondaryEmailPassword?: string
}> {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(':')
      const [username = '', password = '', email = '', emailPassword = '', emailSiteUrl = ''] = parts
      const secondaryEmail = parts[5]?.trim() || undefined
      const secondaryEmailPassword = parts[6]?.trim() || undefined
      return {
        username: username.trim(),
        password: password.trim(),
        email: email.trim(),
        emailPassword: emailPassword.trim(),
        emailSiteUrl: emailSiteUrl.trim(),
        ...(secondaryEmail ? { secondaryEmail } : {}),
        ...(secondaryEmailPassword ? { secondaryEmailPassword } : {}),
      }
    })
    .filter(
      (acc) =>
        acc.username && acc.password && acc.email && acc.emailPassword && acc.emailSiteUrl,
    )
}

export function BulkUploadModal({ onClose }: BulkUploadModalProps) {
  const [productId, setProductId] = useState('')
  const [raw, setRaw] = useState('')

  const { data: productsData } = useProducts({ status: 'active' })
  const { mutate: bulkCreate, isPending } = useBulkCreateAccounts()

  const naProducts = productsData?.data.filter((p) => !/ AA$/i.test(p.name.trim())) ?? []
  const accounts = parseAccountLines(raw)

  const handleSubmit = () => {
    if (!productId || accounts.length === 0) return
    bulkCreate({ productId, accounts }, { onSuccess: onClose })
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="계정 일괄 등록"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isPending}>
            취소
          </Button>
          <Button
            loading={isPending}
            disabled={!productId || accounts.length === 0}
            onClick={handleSubmit}
          >
            {accounts.length > 0 ? `${accounts.length}개 등록` : '등록'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="text-caption-md mb-1.5 block font-semibold text-text-secondary">
            상품 선택 <span className="text-danger">*</span>
          </label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
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

        <div>
          <label className="text-caption-md mb-1.5 block font-semibold text-text-secondary">
            계정 목록
          </label>
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={8}
            placeholder={'아이디:비번:이메일:이메일비번:이메일홈피[:2차이메일:2차이메일비번]\n예) user123:pass456:user@gmail.com:mailpass:https://gmail.com\n예) user123:pass456:user@gmail.com:mailpass:https://gmail.com:sec@mail.com:secpass\n한 줄에 한 계정'}
            className={cn(
              'w-full resize-none rounded-lg border border-border bg-white px-3 py-2',
              'font-mono text-caption-md text-text-primary placeholder:text-text-muted',
              'outline-none transition-colors focus:border-brand',
            )}
          />
          <p className="text-caption-sm mt-1 text-text-muted">
            파싱된 계정:{' '}
            <strong className="text-text-primary">{accounts.length}개</strong>
          </p>
        </div>

        <div className="rounded-lg bg-brand-light p-3">
          <p className="text-caption-md font-semibold text-brand-dark">입력 형식 안내</p>
          <p className="text-caption-sm mt-1 text-text-secondary">
            각 줄에{' '}
            <code className="font-mono">아이디:비번:이메일:이메일비번:이메일홈피[:2차이메일:2차이메일비번]</code>{' '}
            형식으로 입력하세요. 콜론(:)을 구분자로 사용하며 앞 5개 항목은 필수, 2차 이메일과 비밀번호는 선택입니다.
          </p>
        </div>
      </div>
    </Modal>
  )
}
