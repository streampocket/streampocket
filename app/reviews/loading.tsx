// default export는 Next.js loading 파일 규약상 필수 (page.tsx와 동일한 프레임워크 예외)
// 동적 서버 렌더(/reviews, /reviews/[id]) 중에도 클릭 즉시 URL이 전환되도록 하는 Suspense 폴백.
// 리뷰 목록 페이지 구조(제목·필터 바·카드 그리드)를 모사한 스켈레톤.
export default function Loading() {
  return (
    <section className="animate-pulse space-y-6 py-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="h-8 w-40 rounded-lg bg-gray-200" />
          <div className="h-4 w-72 rounded bg-gray-200" />
        </div>
        <div className="h-9 w-28 rounded-lg bg-gray-200" />
      </header>

      <div className="flex flex-wrap gap-2">
        <div className="h-9 w-32 rounded-lg bg-gray-200" />
        <div className="h-9 w-32 rounded-lg bg-gray-200" />
        <div className="h-9 w-24 rounded-lg bg-gray-200" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="space-y-3 rounded-xl border border-border bg-card-bg p-4">
            <div className="h-40 w-full rounded-lg bg-gray-200" />
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-2/3 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </section>
  )
}
