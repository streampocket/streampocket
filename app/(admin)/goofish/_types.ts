export type GoofishReportStatus = 'down' | 'up' | 'same' | 'new' | 'gone' | 'first'

export type GoofishReportItem = {
  productId: string
  name: string
  price: number | null
  todayMinYuan: number | null
  todayCheckedAt: string | null
  prevMinYuan: number | null
  prevCheckedAt: string | null
  deltaYuan: number | null
  status: GoofishReportStatus
}

export type GoofishReportResponse = {
  fetchedAt: string
  products: GoofishReportItem[]
}
