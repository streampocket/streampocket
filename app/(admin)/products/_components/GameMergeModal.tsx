'use client'

import { useMemo, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { STORES } from '@/constants/app'
import { useGames } from '../_hooks/useGames'
import { useMergeGame } from '../_hooks/useMergeGame'
import type { SteamGame } from '@/types/domain'

type GameMergeModalProps = {
  source: SteamGame
  onClose: () => void
}

const STORE_LABEL: Record<string, string> = Object.fromEntries(
  STORES.map((s) => [s.value, s.label]),
)

const inputClass = cn(
  'w-full rounded-lg border border-border bg-white px-3 py-2',
  'text-body-md text-text-primary placeholder:text-text-muted',
  'outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-light',
)

// 소스 게임을 다른 게임에 병합 — 같은 타입 + 소스의 스토어를 아직 안 가진 게임만 대상.
export function GameMergeModal({ source, onClose }: GameMergeModalProps) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<SteamGame | null>(null)
  const merge = useMergeGame(onClose)

  const { data, isLoading } = useGames({ search: search || undefined, page: 1, pageSize: 50 })

  const sourceStores = useMemo(
    () => new Set(source.listings.map((l) => l.store)),
    [source.listings],
  )

  const candidates = useMemo(() => {
    const list = data?.data ?? []
    return list.filter(
      (g) =>
        g.id !== source.id &&
        g.productType === source.productType &&
        !g.listings.some((l) => sourceStores.has(l.store)),
    )
  }, [data, source.id, source.productType, sourceStores])

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="다른 게임과 합치기"
      footer={
        <div className="flex w-full justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={merge.isPending}>
            취소
          </Button>
          <Button
            loading={merge.isPending}
            disabled={!selected}
            onClick={() =>
              selected && merge.mutate({ sourceId: source.id, targetGameId: selected.id })
            }
          >
            합치기
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        <div className="rounded-lg border border-border bg-gray-50 px-3 py-2">
          <p className="text-caption-md text-text-muted">합칠 게임(이게 대상으로 흡수됨)</p>
          <p className="text-body-md text-text-primary">{source.name}</p>
        </div>

        <input
          className={inputClass}
          placeholder="합쳐질 대상 게임 검색 (게임명)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="max-h-72 space-y-1 overflow-y-auto">
          {isLoading ? (
            <p className="text-caption-md py-4 text-center text-text-muted">불러오는 중…</p>
          ) : candidates.length === 0 ? (
            <p className="text-caption-md py-4 text-center text-text-muted">
              합칠 수 있는 게임이 없습니다 (같은 타입 · 스토어 미겹침).
            </p>
          ) : (
            candidates.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setSelected(g)}
                className={cn(
                  'w-full rounded-lg border px-3 py-2 text-left transition',
                  selected?.id === g.id
                    ? 'border-brand bg-brand/5'
                    : 'border-border hover:bg-gray-50',
                )}
              >
                <div className="text-body-sm text-text-primary line-clamp-1">{g.name}</div>
                <div className="text-caption-sm mt-0.5 flex items-center gap-1.5 text-text-muted">
                  {g.listings.map((l) => (
                    <Badge key={l.store} variant="gray">
                      {STORE_LABEL[l.store] ?? l.store}
                    </Badge>
                  ))}
                  {source.productType === 'NA' && <span>· 재고 {g.stockCount}</span>}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  )
}
