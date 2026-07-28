import { userApi } from '@/lib/userApi'

// 세션 내 동일 오류 중복 보고 방지 (재시도 루프로 인한 반복 전송 차단)
const reported = new Set<string>()

type ReportOptions = {
  // 에러 경계가 자동 복구를 시도했는지 — 알림에서 사용자 피해 여부를 구분하기 위해 표시한다
  autoRecovered?: boolean
}

// 화면 크래시를 be로 보고한다 — 실패해도 조용히 무시 (보고가 사용자 경험에 영향 금지).
// 회원 식별은 userApi가 첨부하는 토큰을 서버가 검증해 수행한다 (바디에 신원 미포함).
export function reportUserError(
  error: Error & { digest?: string },
  pathname: string,
  options: ReportOptions = {},
): void {
  const rawMessage = error.message || '알 수 없는 오류'
  // 접두사로 구분 — be 스키마를 바꾸지 않고 디스코드 알림에서 바로 읽힌다
  const message = options.autoRecovered ? `[자동복구] ${rawMessage}` : rawMessage
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
