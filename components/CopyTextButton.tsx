'use client'

import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type CopyTextButtonProps = {
  label: string
  /** 클릭 시점에 만든다 — 만료일 같은 값이 렌더 이후 바뀌어도 최신값을 복사한다 */
  getText: () => string
  variant?: 'default' | 'primary'
}

/**
 * 클릭하면 텍스트를 클립보드에 넣고 토스트로 알리는 버튼.
 * 관리자가 제목만 보고 눌러 고객 안내 양식을 가져가는 용도라 본문은 화면에 펼치지 않는다.
 *
 * 버튼 라벨을 "복사됨"으로 바꾸지 않고 토스트를 쓰는 이유: 양식 버튼이 여러 개라
 * 라벨이 바뀌면 어떤 양식이었는지 사라지고, 다른 화면의 복사 동작도 전부 토스트로 알린다.
 */
export function CopyTextButton({ label, getText, variant = 'default' }: CopyTextButtonProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getText())
    } catch {
      toast.error('복사에 실패했습니다. 브라우저 권한을 확인해 주세요.')
      return
    }
    toast.success(`${label} 복사됨`)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'text-caption-md rounded-lg border px-3 py-1.5 font-medium transition-colors',
        variant === 'primary'
          ? 'border-brand bg-brand-light text-brand-dark hover:bg-brand-light/70'
          : 'border-border bg-white text-text-primary hover:bg-gray-50',
      )}
    >
      {label}
    </button>
  )
}
