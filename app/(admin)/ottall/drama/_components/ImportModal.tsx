'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/lib/utils'
import { useImportDramaMemo } from '../_hooks/useDramaAccounts'
import { formatWho } from '../_lib/dramaView'
import type { ImportResult } from '../_types'

/**
 * 메모장 붙여넣기 이관.
 * 미리보기와 실제 저장이 같은 API(`dryRun` 플래그)를 쓰므로 "본 것과 저장되는 것"이 갈라지지 않는다.
 */
export function ImportModal({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState('')
  const [duplicateMode, setDuplicateMode] = useState<'skip' | 'overwrite'>('skip')
  const [preview, setPreview] = useState<ImportResult | null>(null)

  const importMemo = useImportDramaMemo()

  const runPreview = () => {
    if (!text.trim()) {
      toast.error('메모 내용을 붙여넣어 주세요.')
      return
    }
    importMemo.mutate(
      { text, dryRun: true, duplicateMode },
      {
        onSuccess: (res) => setPreview(res.data),
        onError: (e) => toast.error(e instanceof Error ? e.message : '읽지 못했습니다.'),
      },
    )
  }

  const runImport = () => {
    if (!preview) return
    importMemo.mutate(
      { text, dryRun: false, duplicateMode },
      {
        onSuccess: (res) => {
          const applied = res.data.applied
          toast.success(
            `등록 ${applied?.created ?? 0}건 · 덮어쓰기 ${applied?.overwritten ?? 0}건 · 건너뜀 ${applied?.skipped ?? 0}건`,
          )
          onClose()
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : '등록에 실패했습니다.'),
      },
    )
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="메모 붙여넣기"
      className="max-w-4xl!"
      footer={
        <div className="flex flex-wrap items-center justify-end gap-2">
          {preview && preview.summary.duplicates > 0 && (
            <label className="text-caption-md text-text-secondary mr-auto flex items-center gap-1.5">
              이미 있는 이메일은
              <select
                value={duplicateMode}
                onChange={(e) => {
                  setDuplicateMode(e.target.value === 'overwrite' ? 'overwrite' : 'skip')
                  setPreview(null)
                }}
                className="border-border rounded-lg border px-2 py-1"
              >
                <option value="skip">건너뛰기</option>
                <option value="overwrite">덮어쓰기</option>
              </select>
            </label>
          )}
          <Button variant="secondary" onClick={onClose}>
            닫기
          </Button>
          {preview ? (
            <Button onClick={runImport} loading={importMemo.isPending} disabled={preview.summary.importable === 0}>
              확인한 내용으로 등록
            </Button>
          ) : (
            <Button onClick={runPreview} loading={importMemo.isPending}>
              읽어보기
            </Button>
          )}
        </div>
      }
    >
      <div className="grid gap-3">
        <p className="text-caption-md text-text-secondary">
          메모장 내용을 통째로 붙여넣으세요. 계정 사이는 빈 줄로 구분합니다. 저장 전에 읽은 결과를 먼저 보여드립니다.
        </p>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setPreview(null)
          }}
          spellCheck={false}
          rows={9}
          className="border-border focus:border-brand bg-gray-50 w-full resize-y rounded-lg border p-3 font-mono text-[12.5px] leading-[22px] outline-none"
          placeholder={'[2026-08-29]-릴숏 3인\nsample@gmail.com\n비밀번호\notp시크릿\n(스트림포켓 경원 - 2026.08.05/01:30 7일)'}
        />

        {preview && (
          <>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="blue">계정 {preview.summary.total}개</Badge>
              <Badge variant="gray">파티원 {preview.summary.members}명</Badge>
              {preview.summary.duplicates > 0 && <Badge variant="purple">이미 있음 {preview.summary.duplicates}</Badge>}
              {preview.summary.errors > 0 && <Badge variant="red">오류 {preview.summary.errors}</Badge>}
              {preview.summary.warnings > 0 && <Badge variant="yellow">확인 권장 {preview.summary.warnings}</Badge>}
              {preview.summary.errors === 0 && preview.summary.warnings === 0 && (
                <Badge variant="green">전부 정상</Badge>
              )}
            </div>

            <div className="grid max-h-[38vh] gap-2 overflow-y-auto">
              {preview.items.map((item) => (
                <div
                  key={item.index}
                  className={cn(
                    'border-border rounded-lg border px-3 py-2.5 text-[12.5px]',
                    item.errors.length > 0 && 'border-danger bg-red-50',
                    item.errors.length === 0 && item.warnings.length > 0 && 'border-amber-400 bg-amber-50',
                  )}
                >
                  <p className="font-semibold">
                    {item.index}.{' '}
                    {item.platform
                      ? `${item.platform} ${item.capacityLabel ?? ''} · 마감 ${item.dueAt}`
                      : '계정만 (멤버십 미개설)'}
                    {item.duplicate && <span className="text-text-muted ml-1.5 font-medium">· 이미 등록됨</span>}
                  </p>
                  <p className="text-text-secondary font-mono text-[11.5px] break-all">
                    {item.email ?? '(이메일 없음)'} / {item.password ?? '(비번 없음)'} /{' '}
                    {item.otpSecret ? `${item.otpSecret.slice(0, 8)}…` : '(OTP 없음)'}
                  </p>
                  {item.members.length > 0 && (
                    <p className="text-text-secondary font-mono text-[11.5px]">
                      파티원 {item.members.length}명 ·{' '}
                      {item.members.map((m) => `${formatWho(m)}(${m.endDate} ${m.days}일)`).join(', ')}
                    </p>
                  )}
                  {item.notes.length > 0 && (
                    <p className="text-text-muted font-mono text-[11.5px]">
                      메모로 보존 {item.notes.length}줄 · {item.notes.join(' / ')}
                    </p>
                  )}
                  {item.warnings.length > 0 && (
                    <p className="mt-1 text-[11.5px] text-amber-700">△ {item.warnings.join(' / ')}</p>
                  )}
                  {item.errors.length > 0 && (
                    <p className="text-danger mt-1 text-[11.5px]">⚠ {item.errors.join(' / ')}</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
