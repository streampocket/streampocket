'use client'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useSaveDramaAccountText } from '../_hooks/useDramaAccounts'
import { toMemoText } from '../_lib/dramaView'
import type { DecoratedAccount, TextSaveResult } from '../_types'

type AccountTextModalProps = {
  /** null이면 신규 등록 */
  account: DecoratedAccount | null
  onClose: () => void
}

const PLACEHOLDER = [
  '[2026-08-29]-릴숏 3인',
  'sample@gmail.com',
  '비밀번호',
  'otp시크릿',
  '(스트림포켓 경원 - 2026.08.05/01:30 7일)',
].join('\n')


/** 저장 전 "무엇이 바뀌는지"를 보여준다 — 텍스트 편집은 한 번에 전체가 바뀌기 때문 */
function DiffRow({ label, before, after }: { label: string; before: string; after: string }) {
  const changed = before !== after
  return (
    <div className="grid grid-cols-[64px_1fr] gap-2 text-[12.5px]">
      <span className="text-text-muted">{label}</span>
      {changed ? (
        <span>
          <span className="text-text-muted line-through">{before}</span>
          <span className="mx-1.5">→</span>
          <span className="font-semibold">{after}</span>
        </span>
      ) : (
        <span className="text-text-secondary">{after} <span className="text-text-muted">(변경 없음)</span></span>
      )}
    </div>
  )
}

export function AccountTextModal({ account, onClose }: AccountTextModalProps) {
  const isCreate = account === null
  // 맨 아래 빈 줄을 만들어 두고 커서를 거기에 둔다 — 가장 잦은 작업(파티원 추가)을 바로 시작할 수 있게.
  // 끝 개행은 파서가 블록을 나누지 않으므로 안전하다 (실측 확인).
  const [text, setText] = useState(account ? `${toMemoText(account)}\n` : '')
  const [preview, setPreview] = useState<TextSaveResult | null>(null)
  const areaRef = useRef<HTMLTextAreaElement>(null)

  const save = useSaveDramaAccountText()

  useEffect(() => {
    const area = areaRef.current
    if (!area) return
    area.focus()
    area.setSelectionRange(area.value.length, area.value.length)
    area.scrollTop = area.scrollHeight
  }, [])

  const runPreview = () => {
    if (!text.trim()) {
      toast.error('내용을 입력해 주세요.')
      return
    }
    save.mutate(
      { id: account?.id, text, dryRun: true },
      {
        onSuccess: (res) => setPreview(res.data),
        onError: (e) => toast.error(e instanceof Error ? e.message : '읽지 못했습니다.'),
      },
    )
  }

  const runSave = () => {
    save.mutate(
      { id: account?.id, text, dryRun: false },
      {
        onSuccess: () => {
          toast.success(isCreate ? '계정이 등록되었습니다.' : '저장되었습니다.')
          onClose()
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : '저장에 실패했습니다.'),
      },
    )
  }

  const diff = preview?.diff
  const memberLoss = diff && diff.membersBefore !== null && diff.membersAfter < diff.membersBefore

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isCreate ? '계정 등록' : '계정 수정'}
      className="max-w-3xl!"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            닫기
          </Button>
          {preview ? (
            <Button onClick={runSave} loading={save.isPending}>
              저장
            </Button>
          ) : (
            <Button onClick={runPreview} loading={save.isPending}>
              읽어보기
            </Button>
          )}
        </div>
      }
    >
      <div className="grid gap-3">
        <textarea
          ref={areaRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setPreview(null)
          }}
          spellCheck={false}
          rows={12}
          placeholder={PLACEHOLDER}
          className="border-border focus:border-brand bg-gray-50 w-full resize-y rounded-lg border p-3 font-mono text-[12.5px] leading-[22px] outline-none"
        />

        <p className="text-caption-md text-text-muted">
          첫 줄 = <b>[마감일]-플랫폼 정원</b> (아직 안 열었으면 생략) · 2줄 = 아이디 · 3줄 = 비밀번호 · 4줄 = OTP · 그 아래 = 파티원
          <br />
          빈 줄은 계정을 나누는 구분자입니다. 여러 계정을 한 번에 넣으려면 「메모 붙여넣기」를 사용하세요.
        </p>

        {preview && diff && (
          <div className="border-border grid gap-1.5 rounded-lg border p-3">
            <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
              {memberLoss ? (
                <Badge variant="red">파티원 {diff.membersBefore! - diff.membersAfter}명이 사라집니다</Badge>
              ) : (
                <Badge variant="green">읽기 성공</Badge>
              )}
              {preview.parsed.warnings.length > 0 && (
                <Badge variant="yellow">확인 권장 {preview.parsed.warnings.length}</Badge>
              )}
            </div>

            <DiffRow
              label="파티원"
              before={diff.membersBefore === null ? '—' : `${diff.membersBefore}명`}
              after={`${diff.membersAfter}명`}
            />
            <DiffRow label="이메일" before={diff.emailBefore ?? '—'} after={diff.emailAfter} />
            <DiffRow label="멤버십" before={diff.headBefore ?? '미개설'} after={diff.headAfter ?? '미개설'} />

            {preview.parsed.notes.length > 0 && (
              <p className="text-text-muted mt-1 font-mono text-[11.5px]">
                메모로 보존 {preview.parsed.notes.length}줄 · {preview.parsed.notes.join(' / ')}
              </p>
            )}
            {preview.parsed.warnings.length > 0 && (
              <p className="mt-1 text-[11.5px] text-amber-700">△ {preview.parsed.warnings.join(' / ')}</p>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}
