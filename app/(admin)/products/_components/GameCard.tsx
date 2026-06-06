import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { BadgeVariant } from '@/components/ui/Badge'
import type { SteamGame, StoreListing, ProductStatus, SteamProductType } from '@/types/domain'
import {
  STOCK_THRESHOLD_WARN,
  STOCK_THRESHOLD_CRITICAL,
  MANUAL_PRICE_DISCOUNT_RATE,
  STORES,
} from '@/constants/app'

type GameCardProps = {
  game: SteamGame
  onEdit: (game: SteamGame) => void
}

const STATUS_MAP: Record<ProductStatus, { label: string; variant: BadgeVariant }> = {
  active: { label: '판매 중', variant: 'green' },
  draft: { label: '임시저장', variant: 'gray' },
  inactive: { label: '판매 중지', variant: 'red' },
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

function ListingRow({ listing }: { listing: StoreListing }) {
  const status = STATUS_MAP[listing.status]
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
        <Badge variant={status.variant}>{status.label}</Badge>
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

export function GameCard({ game, onEdit }: GameCardProps) {
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
            <ListingRow key={listing.id} listing={listing} />
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

        <Button
          variant="secondary"
          size="sm"
          className="mt-auto w-full"
          onClick={() => onEdit(game)}
        >
          게임 수정
        </Button>
      </CardBody>
    </Card>
  )
}
