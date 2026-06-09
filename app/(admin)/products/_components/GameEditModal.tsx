'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useUpdateGame } from '../_hooks/useUpdateGame'
import type { SteamGame, SteamProductType } from '@/types/domain'

type GameEditModalProps = {
  game: SteamGame
  onClose: () => void
}

const TYPE_OPTIONS: { value: SteamProductType; label: string }[] = [
  { value: 'NA', label: 'NA · 계정형 (재고 사용)' },
  { value: 'AA', label: 'AA · 선물형' },
  { value: 'BG', label: 'BG · 배틀그라운드' },
]

const inputClass = cn(
  'w-full rounded-lg border border-border bg-white px-3 py-2',
  'text-body-md text-text-primary placeholder:text-text-muted',
  'outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-light',
)

export function GameEditModal({ game, onClose }: GameEditModalProps) {
  const [name, setName] = useState(game.name)
  const [productType, setProductType] = useState<SteamProductType>(game.productType)
  const update = useUpdateGame(onClose)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    update.mutate({ id: game.id, data: { name, productType } })
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="게임 수정"
      footer={
        <div className="flex w-full justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={update.isPending}>
            취소
          </Button>
          <Button form="game-edit-form" type="submit" loading={update.isPending}>
            저장
          </Button>
        </div>
      }
    >
      <form id="game-edit-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-caption-md mb-1.5 block font-semibold text-text-secondary">
            게임명<span className="text-danger">*</span>
          </label>
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-caption-md mb-1.5 block font-semibold text-text-secondary">
            상품 타입
          </label>
          <select
            className={inputClass}
            value={productType}
            // 단언 사유: select option 값이 SteamProductType 으로 한정됨
            onChange={(e) => setProductType(e.target.value as SteamProductType)}
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="text-caption-sm mt-1 text-text-muted">
            NA만 계정 재고를 사용합니다. 동기화 시 상품명으로 자동 판별되며, 잘못 잡힌 경우 수정하세요.
          </p>
        </div>
      </form>
    </Modal>
  )
}
