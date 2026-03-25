'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useEmailTemplate } from '../_hooks/useEmailTemplate'

const inputClass = cn(
  'w-full rounded-lg border border-border bg-white px-3 py-2',
  'text-body-md text-text-primary placeholder:text-text-muted',
  'outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-light',
)

const PLACEHOLDERS = [
  { key: '{productName}', desc: '상품명' },
  { key: '{purchaseDate}', desc: '구매일시' },
  { key: '{accountUsername}', desc: '계정 아이디' },
  { key: '{accountPassword}', desc: '계정 비밀번호' },
  { key: '{accountEmail}', desc: '계정 이메일' },
  { key: '{accountEmailPassword}', desc: '이메일 비밀번호' },
  { key: '{accountEmailSiteUrl}', desc: '이메일 사이트 주소' },
]

export function EmailTemplateForm() {
  const { query, mutation } = useEmailTemplate()
  const [subject, setSubject] = useState('')
  const [bodyTemplate, setBodyTemplate] = useState('')

  useEffect(() => {
    if (query.data) {
      setSubject(query.data.subject)
      setBodyTemplate(query.data.bodyTemplate)
    }
  }, [query.data])

  const handleSave = () => {
    mutation.mutate({ subject, bodyTemplate })
  }

  const isDirty =
    subject !== (query.data?.subject ?? '') ||
    bodyTemplate !== (query.data?.bodyTemplate ?? '')

  return (
    <Card>
      <CardHeader>
        <h2 className="text-heading-sm text-text-primary">이메일 템플릿</h2>
        {query.data && (
          <span className="text-caption-sm text-text-muted">
            마지막 수정: {new Date(query.data.updatedAt).toLocaleDateString('ko-KR')}
          </span>
        )}
      </CardHeader>

      <CardBody className="space-y-4">
        {/* 플레이스홀더 안내 */}
        <div className="rounded-lg bg-brand-light p-3">
          <p className="text-caption-md mb-2 font-semibold text-brand-dark">사용 가능한 플레이스홀더</p>
          <div className="flex flex-wrap gap-2">
            {PLACEHOLDERS.map((ph) => (
              <span key={ph.key} className="text-caption-sm">
                <code className="rounded bg-white px-1.5 py-0.5 font-mono text-brand">
                  {ph.key}
                </code>
                <span className="ml-1 text-text-secondary">{ph.desc}</span>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="text-caption-md mb-1.5 block font-semibold text-text-secondary">
            이메일 제목
          </label>
          <input
            className={inputClass}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="[구매 완료] {상품명}"
          />
        </div>

        <div>
          <label className="text-caption-md mb-1.5 block font-semibold text-text-secondary">
            이메일 본문
          </label>
          <textarea
            className={cn(inputClass, 'resize-none')}
            rows={12}
            value={bodyTemplate}
            onChange={(e) => setBodyTemplate(e.target.value)}
            placeholder="이메일 본문을 입력하세요..."
          />
        </div>
      </CardBody>

      <CardFooter>
        <div className="flex w-full justify-end">
          <Button
            loading={mutation.isPending}
            disabled={!isDirty}
            onClick={handleSave}
          >
            저장
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
