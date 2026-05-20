'use client'

import { useEffect, useMemo, useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import { useOrders } from '@/hooks/useOrders'
import type { ExpenseSteamOrderItem } from '@/types/domain'

type OrderPickerProps = {
  selectedOrderId: string | null
  selectedOrderSummary: ExpenseSteamOrderItem | null
  onChange: (order: ExpenseSteamOrderItem | null) => void
}

export function OrderPicker({ selectedOrderId, selectedOrderSummary, onChange }: OrderPickerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim())
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const queryParams = useMemo(
    () => ({
      receiverName: debouncedTerm || undefined,
      page: 1,
      pageSize: 20,
    }),
    [debouncedTerm],
  )

  const { data, isLoading } = useOrders(queryParams)

  if (selectedOrderId && selectedOrderSummary) {
    return (
      <div className="rounded-lg border border-brand/40 bg-brand/5 px-3 py-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-body-md text-text-primary truncate">
              {selectedOrderSummary.receiverName ?? '(수신자 미상)'} - {selectedOrderSummary.productName}
            </div>
            <div className="text-caption-md text-text-secondary mt-0.5">
              주문번호 {selectedOrderSummary.productOrderId}
              {selectedOrderSummary.paidAt ? ` · 결제 ${formatDate(selectedOrderSummary.paidAt)}` : ''}
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => onChange(null)}>
            해제
          </Button>
        </div>
      </div>
    )
  }

  const orders = data?.data ?? []

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="구매자명으로 검색 (전체 보려면 비워두세요)"
        className="w-full rounded-lg border border-border bg-card-bg px-3 py-2 text-body-md text-text-primary focus:border-brand focus:outline-none"
      />
      <div className="max-h-64 overflow-y-auto rounded-lg border border-border bg-card-bg">
        {isLoading ? (
          <div className="px-3 py-4 text-center text-caption-md text-text-secondary">불러오는 중…</div>
        ) : orders.length === 0 ? (
          <div className="px-3 py-4 text-center text-caption-md text-text-secondary">
            검색된 주문이 없습니다.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {orders.map((order) => {
              const linked = Boolean(order.hasExpense)
              return (
                <li key={order.id}>
                  <button
                    type="button"
                    disabled={linked}
                    onClick={() =>
                      onChange({
                        id: order.id,
                        productOrderId: order.productOrderId,
                        productName: order.productName,
                        receiverName: order.receiverName,
                        paidAt: order.paidAt,
                      })
                    }
                    className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left transition ${
                      linked
                        ? 'cursor-not-allowed bg-card-muted opacity-60'
                        : 'hover:bg-brand/5'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-body-md text-text-primary truncate">
                        {order.receiverName ?? '(수신자 미상)'} - {order.productName}
                      </div>
                      <div className="text-caption-md text-text-secondary mt-0.5">
                        {order.paidAt ? `결제 ${formatDate(order.paidAt)}` : '결제일 미상'}
                      </div>
                    </div>
                    {linked ? (
                      <Badge variant="gray" className="shrink-0">
                        등록됨
                      </Badge>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
