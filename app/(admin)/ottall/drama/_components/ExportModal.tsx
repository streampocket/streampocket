'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { cn, getTodayStringKST } from '@/lib/utils'
import { toMemoTextAll } from '../_lib/dramaView'
import type { DecoratedAccount } from '../_types'

type ExportModalProps = {
  /** 지금 화면에 보이는 계정 (필터·검색·정렬이 적용된 순서 그대로) */
  visible: DecoratedAccount[]
  /** 등록된 전체 계정 */
  all: DecoratedAccount[]
  onClose: () => void
}

type Scope = 'visible' | 'all'

/**
 * 저장된 계정을 메모장 원문으로 되돌려 복사하거나 파일로 내려받는다.
 *
 * 출력이 「메모 붙여넣기」 입력과 같은 형식이라 백업 → 복원이 그대로 닫힌다.
 * 범위를 고르게 한 이유: 필터를 걸어둔 채로도 전체 백업을 뽑을 수 있어야 한다.
 */
export function ExportModal({ visible, all, onClose }: ExportModalProps) {
  const [scope, setScope] = useState<Scope>('visible')

  const accounts = scope === 'visible' ? visible : all
  const text = useMemo(() => toMemoTextAll(accounts), [accounts])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${accounts.length}개 계정을 복사했습니다.`)
    } catch {
      toast.error('복사에 실패했습니다. 아래 내용을 직접 선택해 주세요.')
    }
  }

  const handleDownload = () => {
    // 서버를 거치지 않는다 — 이미 전건을 받아둔 상태라 왕복할 이유가 없다
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `드라마계정_${getTodayStringKST()}.txt`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('파일로 저장했습니다.')
  }

  const scopes: { value: Scope; label: string; count: number }[] = [
    { value: 'visible', label: '지금 화면', count: visible.length },
    { value: 'all', label: '전체', count: all.length },
  ]

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="메모로 추출"
      className="max-w-3xl!"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            닫기
          </Button>
          <Button variant="secondary" onClick={handleDownload} disabled={accounts.length === 0}>
            파일로 저장
          </Button>
          <Button onClick={handleCopy} disabled={accounts.length === 0}>
            복사
          </Button>
        </div>
      }
    >
      <div className="grid gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {scopes.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setScope(option.value)}
              className={cn(
                'text-caption-md cursor-pointer rounded-lg border px-3 py-1.5 font-semibold transition-colors',
                scope === option.value
                  ? 'border-brand bg-brand text-white'
                  : 'border-border bg-card-bg text-text-secondary hover:bg-gray-100',
              )}
            >
              {option.label} <span className="tabular-nums">{option.count}</span>개
            </button>
          ))}
        </div>

        <p className="text-caption-md text-text-muted">
          지금 보이는 순서 그대로 나갑니다. 계정 사이는 빈 줄로 나뉘며,
          <b> 이 내용을 그대로 「메모 붙여넣기」에 다시 넣을 수 있습니다.</b>
        </p>

        <textarea
          value={text}
          readOnly
          spellCheck={false}
          rows={16}
          className="border-border bg-gray-50 w-full resize-y rounded-lg border p-3 font-mono text-[12.5px] leading-[22px] outline-none"
        />

        <p className="text-caption-md text-text-muted">
          계정 <b className="text-text-primary tabular-nums">{accounts.length}</b>개 ·{' '}
          <b className="text-text-primary tabular-nums">{text ? text.split('\n').length : 0}</b>줄
        </p>
      </div>
    </Modal>
  )
}
