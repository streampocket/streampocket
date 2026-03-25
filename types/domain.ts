/** 주문 상태 */
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'DISPATCHED'
  | 'COMPLETED'
  | 'FAILED'
  | 'MANUAL_REVIEW'

/** 주문 */
export type Order = {
  id: string
  productOrderId: string
  productId: string
  buyerName: string
  buyerEmail: string | null
  status: OrderStatus
  errorMsg: string | null
  createdAt: string
  updatedAt: string
}

/** 상품 */
export type Product = {
  id: string
  name: string
  description: string
  caution: string
  event: string | null
  stockCount: number
  createdAt: string
  updatedAt: string
}

/** 코드 */
export type Code = {
  id: string
  productId: string
  value: string
  isUsed: boolean
  createdAt: string
}

/** 대시보드 통계 */
export type DashboardStats = {
  todayOrders: number
  pendingOrders: number
  manualReviewOrders: number
  lowStockProducts: number
}
