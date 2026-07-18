import type { ExpenseCategory, ExpensePayer } from '@/types/domain'

/** 매출 캘린더 일별 아이템 (GET /steam/admin/dashboard/revenue-calendar) */
export type RevenueCalendarItem = {
  date: string
  totalRevenue: number
  netProfit: number
  hasMemo: boolean
}

export type DailyReportOrderLine = {
  productName: string
  settlementAmount: number | null
}

export type DailyReportExpenseItem = {
  category: ExpenseCategory
  payer: ExpensePayer
  amount: number
  memo: string | null
}

/** 분담 정산 송금 방향 — im_to_song: 임정빈→송동건, none: 동일 부담 */
export type DailySettlementTransfer = {
  direction: 'im_to_song' | 'song_to_im' | 'none'
  amount: number
}

/** 일일 종합 리포트 (GET /steam/admin/dashboard/daily-report) — 디스코드 23:59 발송분과 동일 데이터, 전사 기준 */
export type DailyReport = {
  date: string
  orderCount: number
  decidedCount: number
  returnedCount: number
  naverRevenue: number
  naverFee: number
  naverSettlement: number
  manualOrders: DailyReportOrderLine[]
  partyOrders: DailyReportOrderLine[]
  gcoinOrders: DailyReportOrderLine[]
  manualTotal: number
  partyTotal: number
  gcoinTotal: number
  manualRevenueTotal: number
  expenses: DailyReportExpenseItem[]
  expenseTotal: number
  songTotal: number
  imTotal: number
  netProfit: number
  settlement: {
    includingManual: DailySettlementTransfer
    excludingManual: DailySettlementTransfer
  } | null
  memo: string | null
}

export type SaveDailyMemoInput = {
  date: string
  content: string
}
