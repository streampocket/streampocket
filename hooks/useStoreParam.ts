'use client'

import { useSearchParams } from 'next/navigation'

/** URL `?store=` 필터 값을 읽는 공통 훅. 빈 문자열 = 전체(공통 포함). 대시보드·매출 페이지 공유. */
export function useStoreParam(): string {
  const searchParams = useSearchParams()
  return searchParams.get('store') ?? ''
}
