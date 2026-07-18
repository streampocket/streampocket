'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useDailyReport } from '../_hooks/useDailyReport'
import { useSaveDailyMemo } from '../_hooks/useSaveDailyMemo'
import type { ExpenseCategory, ExpensePayer } from '@/types/domain'
import type { DailyReport, DailyReportOrderLine, DailySettlementTransfer } from '../_types'

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  game_purchase: '게임 구매비',
  country_change: '국가변경',
  review_game: '리뷰 게임',
  other: '기타',
}

const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  game_purchase: '🎮',
  country_change: '🌍',
  review_game: '📝',
  other: '📦',
}

const PAYER_LABELS: Record<ExpensePayer, string> = {
  song_donggeon: '송동건',
  im_jeongbin: '임정빈',
}

const MEMO_MAX_LENGTH = 1000

const fmt = (n: number): string => `${n.toLocaleString('ko-KR')}원`

function formatTransfer(transfer: DailySettlementTransfer): string {
  if (transfer.direction === 'none') return '없음 (동일 부담)'
  return transfer.direction === 'im_to_song'
    ? `임정빈 → 송동건 ${fmt(transfer.amount)}`
    : `송동건 → 임정빈 ${fmt(transfer.amount)}`
}

/** 디스코드 순수익 줄과 동일 규칙 — 0원인 항은 생략한 계산식 문자열 */
function formatProfitFormula(report: DailyReport): string {
  const orderProfitTotal = report.manualTotal + report.partyTotal + report.gcoinTotal
  const terms: string[] = [`네이버 정산금 ${report.naverSettlement.toLocaleString('ko-KR')}`]
  if (report.manualRevenueTotal > 0)
    terms.push(`수동매출 ${report.manualRevenueTotal.toLocaleString('ko-KR')}`)
  if (orderProfitTotal > 0) terms.push(`수동/파티/배그 ${orderProfitTotal.toLocaleString('ko-KR')}`)
  const expensePart =
    report.expenseTotal > 0 ? ` − 비용 ${report.expenseTotal.toLocaleString('ko-KR')}` : ''
  return `${terms.join(' + ')}${expensePart}`
}

type DailyReportModalProps = {
  date: string
  onClose: () => void
}

export function DailyReportModal({ date, onClose }: DailyReportModalProps) {
  const { data: report, isLoading } = useDailyReport(date)
  const saveMemoMutation = useSaveDailyMemo()
  const [memoText, setMemoText] = useState('')

  // 리포트 로드 시 저장된 메모로 초기화
  useEffect(() => {
    if (report) setMemoText(report.memo ?? '')
  }, [report])

  const [, month, day] = date.split('-').map(Number)

  async function handleSaveMemo() {
    try {
      const res = await saveMemoMutation.mutateAsync({ date, content: memoText })
      toast.success(res.data.memo === null ? '메모가 삭제되었습니다.' : '메모가 저장되었습니다.')
    } catch (err) {
      const message = err instanceof Error ? err.message : '메모 저장에 실패했습니다.'
      toast.error(message)
    }
  }

  return (
    <Modal isOpen onClose={onClose} title={`${month}월 ${day}일 일일 리포트 (전사 기준)`}>
      {isLoading || !report ? (
        <div className="py-12 text-center text-body-md text-text-muted">리포트를 불러오는 중...</div>
      ) : (
        <div className="space-y-4">
          {/* 주문 건수 */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 rounded-lg bg-gray-50 p-3 text-body-md text-text-secondary">
            <span>📦 주문 {report.orderCount}건</span>
            <span>✅ 구매확정 {report.decidedCount}건</span>
            <span>🔄 반품 {report.returnedCount}건</span>
          </div>

          {/* 네이버 매출 */}
          <section className="space-y-1 text-body-md">
            <div className="flex justify-between">
              <span className="text-text-secondary">💰 네이버 매출</span>
              <span className="font-semibold text-text-primary">{fmt(report.naverRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">🏦 네이버 수수료 (6.63%)</span>
              <span className="text-text-primary">{fmt(report.naverFee)}</span>
            </div>
          </section>

          <OrderSection icon="✋" title="수동 주문" orders={report.manualOrders} total={report.manualTotal} />
          <OrderSection icon="🎉" title="파티 주문" orders={report.partyOrders} total={report.partyTotal} />
          <OrderSection icon="🪙" title="배그 주문" orders={report.gcoinOrders} total={report.gcoinTotal} />

          {/* 수동매출 (매출관리에서 직접 입력한 금액) */}
          {report.manualRevenueTotal > 0 && (
            <div className="flex justify-between text-body-md">
              <span className="text-text-secondary">💵 수동매출</span>
              <span className="font-semibold text-text-primary">{fmt(report.manualRevenueTotal)}</span>
            </div>
          )}

          {/* 비용 */}
          {report.expenses.length > 0 && (
            <section className="space-y-1 border-t border-border pt-3 text-body-md">
              <p className="font-semibold text-text-primary">💸 비용 ({report.expenses.length}건)</p>
              {report.expenses.map((expense, i) => (
                <div key={i} className="flex justify-between pl-2 text-text-secondary">
                  <span className="min-w-0 truncate">
                    {CATEGORY_ICONS[expense.category]} {CATEGORY_LABELS[expense.category]} (
                    {PAYER_LABELS[expense.payer]}){expense.memo ? ` | ${expense.memo}` : ''}
                  </span>
                  <span className="shrink-0 pl-2">{fmt(expense.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-1 font-semibold text-text-primary">
                <span>총합</span>
                <span>{fmt(report.expenseTotal)}</span>
              </div>
              <div className="flex justify-between pl-2 text-caption-md text-text-muted">
                <span>송동건 결제</span>
                <span>{fmt(report.songTotal)}</span>
              </div>
              <div className="flex justify-between pl-2 text-caption-md text-text-muted">
                <span>임정빈 결제</span>
                <span>{fmt(report.imTotal)}</span>
              </div>
            </section>
          )}

          {/* 순수익 — 디스코드 리포트·대시보드와 동일 공식 */}
          <section className="rounded-lg bg-gray-50 p-3">
            <div className="flex items-center justify-between text-body-md">
              <span className="font-semibold text-text-primary">✨ 순수익</span>
              <span
                className={`text-body-lg font-bold ${report.netProfit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}
              >
                {fmt(report.netProfit)}
              </span>
            </div>
            <p className="mt-1 text-caption-sm text-text-muted">{formatProfitFormula(report)}</p>
          </section>

          {/* 분담 정산 */}
          {report.settlement && (
            <section className="space-y-1 text-body-md">
              <p className="font-semibold text-text-primary">💸 분담 정산</p>
              <div className="flex justify-between pl-2 text-text-secondary">
                <span>수동+파티+배그 매출 반영</span>
                <span>{formatTransfer(report.settlement.includingManual)}</span>
              </div>
              <div className="flex justify-between pl-2 text-text-secondary">
                <span>수동+파티+배그 매출 미반영</span>
                <span>{formatTransfer(report.settlement.excludingManual)}</span>
              </div>
            </section>
          )}

          {/* 메모 */}
          <section className="border-t border-border pt-3">
            <p className="mb-2 text-body-md font-semibold text-text-primary">📝 메모</p>
            <textarea
              value={memoText}
              onChange={(e) => setMemoText(e.target.value)}
              maxLength={MEMO_MAX_LENGTH}
              rows={3}
              placeholder="이 날의 메모를 남겨보세요 (비우고 저장하면 삭제됩니다)"
              className="w-full resize-y rounded-lg border border-border p-3 text-body-md text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none"
            />
            <div className="mt-1 flex items-center justify-between">
              <span className="text-caption-sm text-text-muted">
                {memoText.length}/{MEMO_MAX_LENGTH}
              </span>
              <Button size="sm" loading={saveMemoMutation.isPending} onClick={handleSaveMemo}>
                저장
              </Button>
            </div>
          </section>
        </div>
      )}
    </Modal>
  )
}

type OrderSectionProps = {
  icon: string
  title: string
  orders: DailyReportOrderLine[]
  total: number
}

function OrderSection({ icon, title, orders, total }: OrderSectionProps) {
  if (orders.length === 0) return null

  return (
    <section className="space-y-1 border-t border-border pt-3 text-body-md">
      <p className="font-semibold text-text-primary">
        {icon} {title} ({orders.length}건)
      </p>
      {orders.map((order, i) => (
        <div key={i} className="flex justify-between pl-2 text-text-secondary">
          <span className="min-w-0 truncate">{order.productName}</span>
          <span className="shrink-0 pl-2">{fmt(order.settlementAmount ?? 0)}</span>
        </div>
      ))}
      <div className="flex justify-between pt-1 font-semibold text-text-primary">
        <span>소계</span>
        <span>{fmt(total)}</span>
      </div>
    </section>
  )
}
