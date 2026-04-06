'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useMyOwnProducts } from '../_hooks/useMyOwnProducts'
import { cn } from '@/lib/utils'
import type { OwnProductStatus } from '@/types/domain'
import type { BadgeVariant } from '@/components/ui/Badge'

const STATUS_MAP: Record<OwnProductStatus, { label: string; variant: BadgeVariant }> = {
  recruiting: { label: '모집중', variant: 'green' },
  closed: { label: '닫힘', variant: 'red' },
  expired: { label: '만료', variant: 'gray' },
}

const STATUS_FILTERS: Array<{ value: OwnProductStatus | 'all'; label: string }> = [
  { value: 'all', label: '전체' },
  { value: 'recruiting', label: '모집중' },
  { value: 'expired', label: '만료' },
  { value: 'closed', label: '닫힘' },
]

export function MyProductList() {
  const [filter, setFilter] = useState<OwnProductStatus | 'all'>('all')
  const { data: products, isLoading } = useMyOwnProducts()

  const filteredProducts = filter === 'all'
    ? products
    : products?.filter((p) => p.status === filter)

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-heading-lg text-text-primary">내 상품 관리</h1>
        <Link href="/party/new">
          <Button variant="primary" size="sm">+ 상품 등록하기</Button>
        </Link>
      </div>

      {/* 상태 필터 */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              'rounded-full px-4 py-1.5 text-body-md font-medium transition-colors',
              filter === f.value
                ? 'bg-brand text-white'
                : 'bg-gray-100 text-text-secondary hover:bg-gray-200',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 상품 리스트 */}
      {isLoading ? (
        <div className="py-20 text-center text-text-muted">상품을 불러오는 중...</div>
      ) : filteredProducts && filteredProducts.length > 0 ? (
        <div className="space-y-3">
          {filteredProducts.map((product) => {
            const status = STATUS_MAP[product.status]
            return (
              <Link key={product.id} href={`/party/${product.id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardBody>
                    <div className="flex items-center gap-4">
                      {/* 이미지 */}
                      {product.imagePath ? (
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                          <Image
                            src={product.imagePath}
                            alt={product.name}
                            fill
                            className="object-contain"
                            sizes="56px"
                          />
                        </div>
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-text-muted">
                          ?
                        </div>
                      )}

                      {/* 정보 */}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-body-lg truncate font-semibold text-text-primary">
                          {product.name}
                        </h3>
                        <div className="mt-1 flex items-center gap-2 text-body-md text-text-secondary">
                          <span>인당 {product.price.toLocaleString()}원</span>
                          <span>&middot;</span>
                          <span>{product.durationDays}일</span>
                          <span>&middot;</span>
                          <span>{product.filledSlots}/{product.totalSlots}명</span>
                        </div>
                        <p className="text-caption-sm mt-0.5 text-text-muted">
                          등록일: {new Date(product.createdAt).toLocaleDateString('ko-KR')}
                        </p>
                      </div>

                      {/* 상태 + 액션 */}
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="py-20 text-center text-text-muted">
          등록한 상품이 없습니다.
        </div>
      )}
    </div>
  )
}
