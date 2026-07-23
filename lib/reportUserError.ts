import { userApi } from '@/lib/userApi'

// 세션 내 동일 오류 중복 보고 방지 (재시도 루프로 인한 반복 전송 차단)
const reported = new Set<string>()

// 화면 크래시를 be로 보고한다 — 실패해도 조용히 무시 (보고가 사용자 경험에 영향 금지).
// 회원 식별은 userApi가 첨부하는 토큰을 서버가 검증해 수행한다 (바디에 신원 미포함).
export function reportUserError(error: Error & { digest?: string }, pathname: string): void {
  const message = error.message || '알 수 없는 오류'
  const key = `${pathname}::${message}`
  if (reported.has(key)) return
  reported.add(key)

  userApi
    .post('/own/errors', {
      message: message.slice(0, 500),
      path: pathname.slice(0, 300),
      digest: error.digest ?? null,
    })
    .catch(() => {})
}
