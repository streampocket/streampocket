import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { BadgeVariant } from '@/components/ui/Badge'
import type { SteamProduct, ProductStatus } from '@/types/domain'
import { STOCK_THRESHOLD_WARN, STOCK_THRESHOLD_CRITICAL } from '@/constants/app'

type ProductCardProps = {
  product: SteamProduct
  onEdit: (product: SteamProduct) => void
}

const STATUS_MAP: Record<ProductStatus, { label: string; variant: BadgeVariant }> = {
  active: { label: '판매 중', variant: 'green' },
  draft: { label: '임시저장', variant: 'gray' },
  inactive: { label: '판매 중지', variant: 'red' },
}

export function ProductCard({ product, onEdit }: ProductCardProps) {
  const status = STATUS_MAP[product.status]

  const stockVariant: BadgeVariant =
    product.stockCount <= STOCK_THRESHOLD_CRITICAL
      ? 'red'
      : product.stockCount <= STOCK_THRESHOLD_WARN
        ? 'yellow'
        : 'green'

  return (
    <Card className="h-full">
      <CardBody className="flex h-full flex-col">
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="text-heading-sm text-text-primary">{product.name}</h3>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        <div className="mb-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-caption-md text-text-muted">재고</span>
            <Badge variant={stockVariant}>{product.stockCount}개</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-caption-md text-text-muted">네이버 상품 ID</span>
            <span className="font-mono text-caption-md text-text-secondary">
              {product.naverProductId}
            </span>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="mt-auto w-full"
          onClick={() => onEdit(product)}
        >
          수정
        </Button>
      </CardBody>
    </Card>
  )
}
