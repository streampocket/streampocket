export type GcoinOrderStatus = 'pending' | 'approved' | 'rejected'

export type GcoinOrder = {
  id: string
  orderNo: string
  productId: string
  productName: string
  gcoinAmount: number | null
  salePrice: number
  quantity: number
  buyerPhone: string
  status: GcoinOrderStatus
  rejectReason: string | null
  steamOrderItemId: string | null
  approvedAt: string | null
  rejectedAt: string | null
  createdAt: string
  updatedAt: string
}

export type GcoinOrderTabStatus = 'all' | GcoinOrderStatus

export type GcoinOrderStatusCounts = {
  pending: number
  approved: number
  rejected: number
}

export type AdminGcoinOrderListParams = {
  status?: GcoinOrderStatus
  search?: string
  page?: number
  pageSize?: number
}
