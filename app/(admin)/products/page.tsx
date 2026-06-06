'use client'

import { useState, Suspense } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { PRODUCTS_PAGE_SIZE, STORES } from '@/constants/app'
import { StoreTabs } from './_components/StoreTabs'
import { GameCard } from './_components/GameCard'
import { GameEditModal } from './_components/GameEditModal'
import { useGames } from './_hooks/useGames'
import { useSyncGames } from './_hooks/useSyncGames'
import type { SteamGame, Store } from '@/types/domain'

function isStore(value: string): value is Store {
  return STORES.some((s) => s.value === value)
}

function GamesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [editingGame, setEditingGame] = useState<SteamGame | null>(null)
  const [search, setSearch] = useState(searchParams.get('search') ?? '')

  const storeParam = searchParams.get('store') ?? ''
  const store = isStore(storeParam) ? storeParam : undefined
  const page = Number(searchParams.get('page') ?? 1)

  const { data, isLoading } = useGames({
    store,
    search: search || undefined,
    page,
    pageSize: PRODUCTS_PAGE_SIZE,
  })
  const { mutate: sync, isPending: isSyncing } = useSyncGames()

  const handleSearchChange = (value: string) => {
    setSearch(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set('search', value)
    else params.delete('search')
    params.delete('page')
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const handlePageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(nextPage))
    router.push(`${pathname}?${params.toString()}`)
  }

  const syncLabel = store
    ? `${STORES.find((s) => s.value === store)?.label} 동기화`
    : '전체 동기화'

  return (
    <>
      <input
        type="text"
        placeholder="게임명 검색..."
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="text-body-md w-full rounded-lg border border-border bg-card-bg px-4 py-2 text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none md:max-w-xs"
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <StoreTabs counts={data?.counts} />
        <div className="flex items-center gap-2">
          <span className="text-caption-md text-text-muted">{data?.total ?? 0}개 게임</span>
          <Button variant="secondary" size="sm" loading={isSyncing} onClick={() => sync(store)}>
            {syncLabel}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-caption-md py-16 text-center text-text-muted">로딩 중...</p>
      ) : data?.data.length === 0 ? (
        <p className="text-caption-md py-16 text-center text-text-muted">게임이 없습니다</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data?.data.map((game) => (
            <GameCard key={game.id} game={game} onEdit={setEditingGame} />
          ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex w-full items-center justify-center gap-2 pt-4">
          <Button
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
          >
            이전
          </Button>
          <span className="text-caption-md text-text-secondary">
            {page} / {data.totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= data.totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            다음
          </Button>
        </div>
      )}

      {editingGame && (
        <GameEditModal game={editingGame} onClose={() => setEditingGame(null)} />
      )}
    </>
  )
}

export default function ProductsPage() {
  return (
    <div className="space-y-4">
      <Suspense>
        <GamesContent />
      </Suspense>
    </div>
  )
}
