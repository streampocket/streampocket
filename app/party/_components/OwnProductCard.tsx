'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { OwnProduct, OwnProductStatus } from '@/types/domain'
import type { BadgeVariant } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

type OwnProductCardProps = {
  product: OwnProduct
}

const STATUS_MAP: Record<OwnProductStatus, { label: string; variant: BadgeVariant }> = {
  recruiting: { label: '모집중', variant: 'green' },
  closed: { label: '닫힘', variant: 'red' },
  expired: { label: '만료', variant: 'gray' },
}

export function OwnProductCard({ product }: OwnProductCardProps) {
  const status = STATUS_MAP[product.status]
  const progress = product.totalSlots > 0
    ? Math.round((product.filledSlots / product.totalSlots) * 100)
    : 0
  const isInactive = product.status !== 'recruiting'

  return (
    <Link href={`/party/${product.id}`}>
      <Card
        className={cn(
          'overflow-hidden transition-shadow hover:shadow-md',
          isInactive && 'opacity-60',
        )}
      >
        {/* 이미지 영역 */}
        <div className="flex items-center justify-center bg-gray-50 p-4">
          {product.imagePath ? (
            <div className="relative h-16 w-16">
              <Image
                src={product.imagePath}
                alt={product.name}
                fill
                className="object-contain"
                sizes="64px"
              />
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-200 text-text-muted">
              <span className="text-heading-lg">?</span>
            </div>
          )}
        </div>

        {/* 정보 영역 */}
        <div className="space-y-2 p-4">
          <div className="flex items-center gap-2">
            <Badge variant="blue">{product.category.name}</Badge>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>

          <h3 className="text-body-lg line-clamp-2 font-semibold text-text-primary">
            {product.name}
          </h3>

          <div className="flex items-center gap-3 text-body-md text-text-secondary">
            <span>인당 {product.price.toLocaleString()}원</span>
            <span>{product.durationDays}일</span>
          </div>

          {/* 모집 프로그레스 */}
          <div>
            <div className="mb-1 flex items-center justify-between text-caption-sm text-text-muted">
              <span>모집 현황</span>
              <span>{product.filledSlots}/{product.totalSlots}명</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  progress >= 100 ? 'bg-gray-400' : 'bg-brand',
                )}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
