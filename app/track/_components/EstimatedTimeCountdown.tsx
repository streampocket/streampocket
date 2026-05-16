'use client'

import { useEffect, useState } from 'react'

type EstimatedTimeCountdownProps = {
  /** 예상 완료시각 (ISO 8601 절대시각) */
  estimatedCompletedAt: string
}

/** 절대시각을 KST 'HH:mm'로 포맷 */
function formatTimeKST(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Seoul',
  }).format(date)
}

/**
 * 진행중(2단계) 주문의 예상 소요시간 카운트다운.
 * 자체 1초 타이머로 매끄럽게 줄어든다 (조회 폴링과 독립).
 * 예상시각을 넘기면 "곧 완료될 예정이에요"로 전환.
 */
export function EstimatedTimeCountdown({ estimatedCompletedAt }: EstimatedTimeCountdownProps) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const target = new Date(estimatedCompletedAt)
  const remainingMs = target.getTime() - now
  const isOverdue = remainingMs <= 0
  const remainingMinutes = Math.ceil(remainingMs / 60_000)

  return (
    <div className="mb-4 rounded-lg bg-brand-light px-4 py-3 text-center">
      {isOverdue ? (
        <p className="text-body-md font-semibold text-brand">곧 완료될 예정이에요</p>
      ) : (
        <p className="text-body-md font-semibold text-brand">
          {remainingMinutes}분 남음
          <span className="ml-1 text-caption-md font-normal text-text-secondary">
            ({formatTimeKST(target)} 완료 예정)
          </span>
        </p>
      )}
    </div>
  )
}
