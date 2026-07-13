'use client'

import Image from 'next/image'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardFooter } from '@/components/ui/Card'
import type { BadgeVariant } from '@/components/ui/Badge'
import type { GcoinProduct, GcoinProductStatus } from '../_types'

type ProductTableProps = {
  products: GcoinProduct[]
  total: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onEdit: (product: GcoinProduct) => void
  onDelete: (product: GcoinProduct) => void
}

export const GCOIN_STATUS_BADGE: Record<GcoinProductStatus, { variant: BadgeVariant; label: string }> = {
  on_sale: { variant: 'green', label: '판매중' },
  hidden: { variant: 'gray', label: '숨김' },
  sold_out: { variant: 'red', label: '품절' },
}

function formatPrice(amount: number): string {
  return amount.toLocaleString('ko-KR')
}

function PriceCell({ product }: { product: GcoinProduct }) {
  if (product.listPrice !== null && product.listPrice > product.salePrice) {
    return (
      <span>
        <span className="text-text-muted line-through">{formatPrice(product.listPrice)}</span>{' '}
        <span className="font-medium text-brand">{formatPrice(product.salePrice)}원</span>
      </span>
    )
  }
  return <span>{formatPrice(product.salePrice)}원</span>
}

function Thumbnail({ product }: { product: GcoinProduct }) {
  if (!product.imageUrl) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-caption-sm text-text-muted">
        —
      </div>
    )
  }
  return (
    <Image
      src={product.imageUrl}
      alt={product.name}
      width={40}
      height={40}
      className="h-10 w-10 rounded-lg object-cover"
    />
  )
}

export function ProductTable({
  products,
  total,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-body-md text-text-muted">상품이 없습니다.</p>
      </div>
    )
  }

  return (
    <Card>
      <div className="px-5 py-4">
        <p className="text-body-md text-text-secondary">총 {total}건</p>
      </div>

      <CardBody className="p-0">
        {/* 데스크탑 테이블 */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">이미지</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">상품명</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">지코인</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">가격</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">구매수</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">진열</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">상태</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">관리</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const badge = GCOIN_STATUS_BADGE[product.status]
                return (
                  <tr
                    key={product.id}
                    className="border-b border-border transition-colors hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <Thumbnail product={product} />
                    </td>
                    <td className="text-body-md px-4 py-3 font-medium text-text-primary">
                      {product.name}
                    </td>
                    <td className="text-body-md px-4 py-3 text-text-secondary">
                      {formatPrice(product.gcoinAmount)} G
                    </td>
                    <td className="text-body-md px-4 py-3 text-text-secondary">
                      <PriceCell product={product} />
                    </td>
                    <td className="text-body-md px-4 py-3 text-text-secondary">
                      {formatPrice(product.purchaseCount)}회
                    </td>
                    <td className="text-body-md px-4 py-3 text-text-secondary">
                      {product.sortOrder}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="secondary" size="sm" onClick={() => onEdit(product)}>
                          수정
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => onDelete(product)}>
                          삭제
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* 모바일 카드 */}
        <div className="space-y-3 p-4 md:hidden">
          {products.map((product) => {
            const badge = GCOIN_STATUS_BADGE[product.status]
            return (
              <div
                key={product.id}
                className="rounded-lg border border-border bg-card-bg p-4"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <Thumbnail product={product} />
                    <span className="text-body-md truncate font-medium text-text-primary">
                      {product.name}
                    </span>
                  </div>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </div>
                <p className="text-caption-md text-text-secondary">
                  {formatPrice(product.gcoinAmount)} G · <PriceCell product={product} />
                </p>
                <p className="text-caption-md mt-1 text-text-secondary">
                  구매 {formatPrice(product.purchaseCount)}회 · 진열 {product.sortOrder}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => onEdit(product)}>
                    수정
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => onDelete(product)}>
                    삭제
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardBody>

      {totalPages > 1 && (
        <CardFooter className="flex items-center justify-center gap-2 px-5 py-4">
          <Button
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            이전
          </Button>
          <span className="text-body-md text-text-secondary">
            {page} / {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            다음
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
