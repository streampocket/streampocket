/** 백엔드 공통 응답 래퍼 */
export type ApiResponse<T> = {
  data: T
  message?: string
}

/** 페이지네이션 응답 */
export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/** 공통 에러 응답 */
export type ApiError = {
  message: string
  code?: string
}
