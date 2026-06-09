'use client'

import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { BadgeVariant } from '@/components/ui/Badge'
import type { SteamGame, StoreListing, SteamProductType } from '@/types/domain'
import {
  STOCK_THRESHOLD_WARN,
  STOCK_THRESHOLD_CRITICAL,
  MANUAL_PRICE_DISCOUNT_RATE,
  STORES,
} from '@/constants/app'
import { useSplitListing } from '../_hooks/useSplitListing'

type GameCardProps = {
  game: SteamGame
  onEdit: (game: SteamGame) => void
  onMerge: (game: SteamGame) => void
}

// 네이버 실제 판매상태(statusType) → 뱃지. 미정의 값은 원문 노출, null은 상태미상.
const SALE_STATUS_MAP: Record<string, { label: string; variant: BadgeVariant }> = {
  SALE: { label: '판매중', variant: 'green' },
  OUTOFSTOCK: { label: '품절', variant: 'yellow' },
  SUSPENSION: { label: '판매중지', variant: 'red' },
  WAIT: { label: '판매대기', variant: 'gray' },
  CLOSE: { label: '판매종료', variant: 'gray' },
  PROHIBITION: { label: '판매금지', variant: 'red' },
  UNADMISSION: { label: '승인대기', variant: 'gray' },
  REJECTION: { label: '승인거부', variant: 'red' },
}

function saleStatusBadge(status: string | null): { label: string; variant: BadgeVariant } {
  if (!status) return { label: '상태미상', variant: 'gray' }
  return SALE_STATUS_MAP[status] ?? { label: status, variant: 'gray' }
}

const TYPE_MAP: Record<SteamProductType, { label: string; variant: BadgeVariant }> = {
  NA: { label: 'NA · 계정형', variant: 'blue' },
  AA: { label: 'AA · 선물형', variant: 'purple' },
  BG: { label: 'BG · 배그', variant: 'indigo' },
}

const STORE_LABEL: Record<string, string> = Object.fromEntries(
  STORES.map((s) => [s.value, s.label]),
)

function formatWon(value: number | null): string {
  return value != null ? `${value.toLocaleString()}원` : '-'
}

function discountText(listing: StoreListing): string | null {
  const { discountPricePc: pc, discountPriceMobile: mobile } = listing
  if (pc == null && mobile == null) return null
  if (pc != null && mobile != null && pc === mobile) return `할인가 ${formatWon(pc)}`
  const parts: string[] = []
  if (pc != null) parts.push(`할인가(PC) ${formatWon(pc)}`)
  if (mobile != null) parts.push(`할인가(모바일) ${formatWon(mobile)}`)
  return parts.join(' · ')
}

function ListingRow({
  listing,
  canSplit,
  onSplit,
  splitting,
}: {
  listing: StoreListing
  canSplit: boolean
  onSplit: (listingId: string) => void
  splitting: boolean
}) {
  const status = saleStatusBadge(listing.naverSaleStatus)
  const manualPrice =
    listing.price != null
      ? Math.round(listing.price * (1 - MANUAL_PRICE_DISCOUNT_RATE))
      : null
  const discount = discountText(listing)

  return (
    <div className="rounded-lg border border-border bg-gray-50 px-3 py-2">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-caption-md font-semibold text-text-primary">
          {STORE_LABEL[listing.store] ?? listing.store}
        </span>
        <div className="flex items-center gap-1.5">
          <Badge variant={status.variant}>{status.label}</Badge>
          {canSplit && (
            <button
              type="button"
              disabled={splitting}
              onClick={() => onSplit(listing.id)}
              className="text-caption-sm text-text-muted hover:text-danger disabled:opacity-50"
            >
              분리
            </button>
          )}
        </div>
      </div>
      <div className="text-caption-md text-text-secondary">
        판매가 {formatWon(listing.price)}
        {manualPrice != null && <> · 수동가 {formatWon(manualPrice)}</>}
        {discount && <> · {discount}</>}
      </div>
      <div className="text-caption-sm mt-0.5 font-mono text-text-muted">
        ID {listing.naverProductId}
      </div>
    </div>
  )
}

export function GameCard({ game, onEdit, onMerge }: GameCardProps) {
  const split = useSplitListing()
  const canSplit = game.listings.length >= 2
  const type = TYPE_MAP[game.productType]
  const isStockType = game.productType === 'NA'
  const stockVariant: BadgeVariant =
    game.stockCount <= STOCK_THRESHOLD_CRITICAL
      ? 'red'
      : game.stockCount <= STOCK_THRESHOLD_WARN
        ? 'yellow'
        : 'green'

  const missingStores = STORES.filter(
    (s) => !game.listings.some((l) => l.store === s.value),
  )

  return (
    <Card className="h-full">
      <CardBody className="flex h-full flex-col">
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="text-heading-sm text-text-primary">{game.name}</h3>
          <Badge variant={type.variant}>{type.label}</Badge>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <span className="text-caption-md text-text-muted">재고 (공유)</span>
          {isStockType ? (
            <Badge variant={stockVariant}>{game.stockCount}개</Badge>
          ) : (
            <Badge variant="gray">해당없음</Badge>
          )}
        </div>

        <div className="mb-4 space-y-2">
          {game.listings.map((listing) => (
            <ListingRow
              key={listing.id}
              listing={listing}
              canSplit={canSplit}
              onSplit={(id) => split.mutate(id)}
              splitting={split.isPending}
            />
          ))}
          {missingStores.map((s) => (
            <div
              key={s.value}
              className="text-caption-sm rounded-lg border border-dashed border-border px-3 py-2 text-text-muted"
            >
              {s.label} · 미등록
            </div>
          ))}
        </div>

        <div className="mt-auto flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(game)}
          >
            게임 수정
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => onMerge(game)}
          >
            합치기
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}
