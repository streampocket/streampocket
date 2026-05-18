'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useOrderSearch } from '../_hooks/useOrderSearch'
import { useLinkOrder } from '../_hooks/useLinkOrder'

type OrderLinkModalProps = {
  registrationId: string
  defaultSearch: string
  onClose: () => void
}

const searchInputClass = cn(
  'flex-1 rounded-lg border border-border bg-white px-3 py-2',
  'text-body-md text-text-primary placeholder:text-text-muted',
  'outline-none transition-colors focus:border-brand',
)

export function OrderLinkModal({ registrationId, defaultSearch, onClose }: OrderLinkModalProps) {
  const [search, setSearch] = useState(defaultSearch)
  const [query, setQuery] = useState(defaultSearch)
  const { data, isLoading } = useOrderSearch(query)
  const { mutate: link, isPending } = useLinkOrder()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setQuery(search)
  }

  const handleLink = (orderItemId: string) => {
    link({ id: registrationId, orderItemId }, { onSuccess: onClose })
  }

  const orders = data?.data ?? []

  return (
    <Modal isOpen onClose={onClose} title="주문 연결">
      <div className="space-y-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            className={searchInputClass}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="구매자명으로 검색"
          />
          <Button type="submit" size="sm" variant="secondary">
            검색
          </Button>
        </form>

        {query.trim().length === 0 ? (
          <p className="py-6 text-center text-caption-md text-text-muted">
            구매자명을 입력해 주문을 검색하세요.
          </p>
        ) : isLoading ? (
          <p className="py-6 text-center text-caption-md text-text-muted">검색 중...</p>
        ) : orders.length === 0 ? (
          <p className="py-6 text-center text-caption-md text-text-muted">검색 결과가 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-border p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-body-md text-text-primary">{order.productName}</p>
                  <p className="text-caption-sm text-text-muted">
                    {order.receiverName ?? '이름 미확인'} · 상품주문번호 {order.productOrderId}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  loading={isPending}
                  onClick={() => handleLink(order.id)}
                >
                  연결
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}
