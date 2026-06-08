'use client'

import { useSearchParams } from 'next/navigation'

/** 대시보드 위젯들이 공유하는 `?store=` 필터 값. 빈 문자열 = 전체(공통 포함). */
export function useStoreParam(): string {
  const searchParams = useSearchParams()
  return searchParams.get('store') ?? ''
}
