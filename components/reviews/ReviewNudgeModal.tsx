'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useReviewableApplications } from '@/hooks/useReviewableApplications'
import { isUserAuthenticated } from '@/lib/userAuth'
import { isAdminPath } from '@/lib/adminPaths'
import { getTodayStringKST } from '@/lib/utils'
import { REVIEW_NUDGE_CLOSED_KEY, REVIEW_NUDGE_HIDE_DATE_KEY } from '@/constants/app'

// 숨김 상태 판정 — 스토리지 접근은 시크릿 모드 등에서 던질 수 있어 실패 시 "숨김"으로 취급
// (조회도 노출도 안 하는 쪽이 안전)
function isDismissed(): boolean {
  try {
    if (window.sessionStorage.getItem(REVIEW_NUDGE_CLOSED_KEY) === '1') return true
    return window.localStorage.getItem(REVIEW_NUDGE_HIDE_DATE_KEY) === getTodayStringKST()
  } catch {
    return true
  }
}

// 리뷰 유도 모달 — 확정된 파티 중 리뷰 미작성 건이 있는 로그인 유저에게 유저 페이지 진입 시 노출.
// 루트 레이아웃에 마운트되므로 관리자 화면·리뷰 작성 페이지는 경로로 거른다.
export function ReviewNudgeModal() {
  const pathname = usePathname()
  const router = useRouter()
  const [closed, setClosed] = useState(false)
  // 로그인·숨김 판정은 클라이언트 스토리지 기반이라 마운트 후에만 확정 (SSR 불일치 방지)
  const [eligible, setEligible] = useState(false)

  useEffect(() => {
    setEligible(isUserAuthenticated() && !isDismissed())
  }, [])

  const excluded = isAdminPath(pathname) || pathname.startsWith('/reviews/new')
  // redirectOn401: false — 공개 페이지에서 배경으로 도는 조회라, 세션이 만료됐으면
  // 방문자를 로그인으로 튕기지 말고 모달만 조용히 포기한다
  const query = useReviewableApplications({ enabled: eligible && !excluded, redirectOn401: false })
  const reviewableCount = query.data?.length ?? 0

  if (excluded || closed || !eligible || reviewableCount === 0) return null

  // 닫기(X·ESC·오버레이 포함) — 이번 브라우저 세션 동안 다시 안 뜬다
  const close = () => {
    try {
      window.sessionStorage.setItem(REVIEW_NUDGE_CLOSED_KEY, '1')
    } catch {
      // 저장 실패해도 이번 렌더에서는 닫는다
    }
    setClosed(true)
  }

  const hideToday = () => {
    try {
      window.localStorage.setItem(REVIEW_NUDGE_HIDE_DATE_KEY, getTodayStringKST())
    } catch {
      // 저장 실패 시 세션 닫기로라도 처리
    }
    close()
  }

  const goWrite = () => {
    close()
    router.push('/reviews/new')
  }

  return (
    <Modal
      isOpen
      onClose={close}
      title="리뷰 쓰고 포인트 받으세요! 🎁"
      // 이 모달만 모바일에서도 전체화면이 아닌 데스크탑형 카드로 띄운다 —
      // 유도 팝업이 화면 전체를 덮으면 부담스럽다. cn이 tailwind-merge가 아니라 `!`로 강제
      className="max-sm:mx-4! max-sm:h-auto! max-sm:max-h-[90vh]! max-sm:max-w-100! max-sm:rounded-xl!"
    >
      <div className="space-y-5">
        <div className="rounded-lg bg-gray-50 p-5 text-center">
          <p className="text-heading-md font-semibold text-text-primary">
            지금 리뷰를 작성하면 <span className="text-brand">포인트 지급!</span>
          </p>
          <p className="mt-2 text-body-md text-text-muted">
            참여했던 파티의 솔직한 후기를 남기고 포인트를 받아가세요.
            <br />
            받은 포인트는 다음 파티 신청 때 결제 금액에서 차감돼요.
          </p>
        </div>

        <Button
          variant="primary"
          className="text-body-lg h-11 w-full font-semibold"
          onClick={goWrite}
        >
          지금 리뷰 쓰기
        </Button>

        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={hideToday}
            className="text-body-md text-text-muted underline-offset-2 hover:underline"
          >
            오늘 하루 안 보기
          </button>
          <span className="text-body-md text-text-muted">·</span>
          <button
            type="button"
            onClick={close}
            className="text-body-md text-text-muted underline-offset-2 hover:underline"
          >
            닫기
          </button>
        </div>
      </div>
    </Modal>
  )
}
