'use client'

import { useState, useCallback } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useDashboardStats } from '../_hooks/useDashboardStats'
import { useUpdateCommissionRate } from '../_hooks/useCommissionRate'
import { useUpdateMonthlyAdjustment } from '../_hooks/useMonthlyAdjustment'

type Period = 'today' | 'week' | 'month' | 'all'

const PERIOD_LABELS: Record<Period, string> = {
  today: '오늘',
  week: '이번 주',
  month: '이번 달',
  all: '전체',
}

function formatCurrency(value: number): string {
  return `${value.toLocaleString('ko-KR')}원`
}

function getCurrentYearMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

type AdjustmentField = 'paymentAdjustment' | 'commissionAdjustment' | 'netRevenueAdjustment'

type AdjustmentModalState = {
  isOpen: boolean
  field: AdjustmentField
  label: string
  currentValue: number
}

export function RevenueStats() {
  const [period, setPeriod] = useState<Period>('month')
  const { data, isLoading } = useDashboardStats(period)

  const [commissionModal, setCommissionModal] = useState(false)
  const [commissionInput, setCommissionInput] = useState('')
  const updateCommission = useUpdateCommissionRate()

  const [adjModal, setAdjModal] = useState<AdjustmentModalState>({
    isOpen: false,
    field: 'paymentAdjustment',
    label: '',
    currentValue: 0,
  })
  const [adjInput, setAdjInput] = useState('')
  const [adjMemo, setAdjMemo] = useState('')
  const updateAdjustment = useUpdateMonthlyAdjustment()

  const revenue = data?.revenue
  const canEditAdjustment = period === 'month' || period === 'all'

  const openAdjustmentModal = useCallback(
    (field: AdjustmentField, label: string, currentValue: number) => {
      setAdjModal({ isOpen: true, field, label, currentValue })
      setAdjInput(String(currentValue))
      setAdjMemo('')
    },
    [],
  )

  const handleSaveAdjustment = useCallback(() => {
    if (!revenue) return
    const value = parseInt(adjInput, 10)
    if (isNaN(value)) return

    updateAdjustment.mutate(
      {
        yearMonth: getCurrentYearMonth(),
        paymentAdjustment:
          adjModal.field === 'paymentAdjustment' ? value : revenue.adjustment.payment,
        commissionAdjustment:
          adjModal.field === 'commissionAdjustment' ? value : revenue.adjustment.commission,
        netRevenueAdjustment:
          adjModal.field === 'netRevenueAdjustment' ? value : revenue.adjustment.net,
        memo: adjMemo || undefined,
      },
      {
        onSuccess: () => setAdjModal((prev) => ({ ...prev, isOpen: false })),
      },
    )
  }, [adjInput, adjMemo, adjModal.field, revenue, updateAdjustment])

  const handleSaveCommission = useCallback(() => {
    const value = parseFloat(commissionInput)
    if (isNaN(value) || value < 0 || value > 100) return

    updateCommission.mutate(value, {
      onSuccess: () => setCommissionModal(false),
    })
  }, [commissionInput, updateCommission])

  const openCommissionModal = useCallback(() => {
    setCommissionInput(String(revenue?.commissionRate ?? 0))
    setCommissionModal(true)
  }, [revenue?.commissionRate])

  return (
    <>
      <Card>
        <CardHeader>
          <h2 className="text-heading-md text-text-primary">매출 통계</h2>
          <div className="flex gap-1">
            {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-lg px-3 py-1.5 text-caption-md font-medium transition-colors ${
                  period === p
                    ? 'bg-brand text-white'
                    : 'text-text-muted hover:bg-gray-100'
                }`}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* 총 결제액 */}
            <div className="relative">
              <StatCard
                label="총 결제액"
                value={isLoading ? '-' : formatCurrency(revenue?.total.payment ?? 0)}
                sub={
                  revenue && revenue.adjustment.payment !== 0
                    ? `보정: ${revenue.adjustment.payment > 0 ? '+' : ''}${formatCurrency(revenue.adjustment.payment)}`
                    : undefined
                }
              />
              {canEditAdjustment && (
                <button
                  onClick={() =>
                    openAdjustmentModal(
                      'paymentAdjustment',
                      '총 결제액 보정',
                      revenue?.adjustment.payment ?? 0,
                    )
                  }
                  className="absolute right-3 top-3 text-caption-sm text-text-muted hover:text-brand"
                >
                  보정
                </button>
              )}
            </div>

            {/* 수수료 */}
            <div className="relative">
              <StatCard
                label={`수수료 (${revenue?.commissionRate ?? 0}%)`}
                value={isLoading ? '-' : formatCurrency(revenue?.total.commission ?? 0)}
                sub={
                  revenue && revenue.adjustment.commission !== 0
                    ? `보정: ${revenue.adjustment.commission > 0 ? '+' : ''}${formatCurrency(revenue.adjustment.commission)}`
                    : undefined
                }
              />
              {canEditAdjustment && (
                <button
                  onClick={() =>
                    openAdjustmentModal(
                      'commissionAdjustment',
                      '수수료 보정',
                      revenue?.adjustment.commission ?? 0,
                    )
                  }
                  className="absolute right-3 top-3 text-caption-sm text-text-muted hover:text-brand"
                >
                  보정
                </button>
              )}
            </div>

            {/* 순수익 */}
            <div className="relative">
              <StatCard
                label="순수익"
                value={isLoading ? '-' : formatCurrency(revenue?.total.net ?? 0)}
                sub={
                  revenue && revenue.adjustment.net !== 0
                    ? `보정: ${revenue.adjustment.net > 0 ? '+' : ''}${formatCurrency(revenue.adjustment.net)}`
                    : undefined
                }
              />
              {canEditAdjustment && (
                <button
                  onClick={() =>
                    openAdjustmentModal(
                      'netRevenueAdjustment',
                      '순수익 보정',
                      revenue?.adjustment.net ?? 0,
                    )
                  }
                  className="absolute right-3 top-3 text-caption-sm text-text-muted hover:text-brand"
                >
                  보정
                </button>
              )}
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              onClick={openCommissionModal}
              className="text-caption-md text-text-muted hover:text-brand"
            >
              수수료율 설정: {revenue?.commissionRate ?? 0}% ✏
            </button>
          </div>
        </CardBody>
      </Card>

      {/* 수수료율 설정 모달 */}
      <Modal
        isOpen={commissionModal}
        onClose={() => setCommissionModal(false)}
        title="수수료율 설정"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setCommissionModal(false)}>
              취소
            </Button>
            <Button
              size="sm"
              onClick={handleSaveCommission}
              loading={updateCommission.isPending}
            >
              저장
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <label className="text-body-md text-text-secondary">
            네이버 스마트스토어 수수료율 (%)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={commissionInput}
            onChange={(e) => setCommissionInput(e.target.value)}
            className="w-full rounded-lg border border-border bg-card-bg px-3 py-2 text-body-md text-text-primary focus:border-brand focus:outline-none"
          />
        </div>
      </Modal>

      {/* 보정액 편집 모달 */}
      <Modal
        isOpen={adjModal.isOpen}
        onClose={() => setAdjModal((prev) => ({ ...prev, isOpen: false }))}
        title={adjModal.label}
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setAdjModal((prev) => ({ ...prev, isOpen: false }))}
            >
              취소
            </Button>
            <Button
              size="sm"
              onClick={handleSaveAdjustment}
              loading={updateAdjustment.isPending}
            >
              저장
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-body-md text-text-secondary">
              보정 금액 (양수: 추가 / 음수: 차감)
            </label>
            <input
              type="number"
              value={adjInput}
              onChange={(e) => setAdjInput(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-card-bg px-3 py-2 text-body-md text-text-primary focus:border-brand focus:outline-none"
              placeholder="예: 5000 또는 -3000"
            />
          </div>
          <div>
            <label className="text-body-md text-text-secondary">메모 (선택)</label>
            <input
              type="text"
              value={adjMemo}
              onChange={(e) => setAdjMemo(e.target.value)}
              maxLength={500}
              className="mt-1 w-full rounded-lg border border-border bg-card-bg px-3 py-2 text-body-md text-text-primary focus:border-brand focus:outline-none"
              placeholder="예: 외부 직거래 매출 추가"
            />
          </div>
        </div>
      </Modal>
    </>
  )
}
