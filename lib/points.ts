// 포인트 표시·계산을 한 곳에 모은다.
// 결제 금액이 신청 완료 모달·마이페이지·관리자 신청관리·회원관리 등 여러 화면에 나오는데,
// 화면마다 계산식을 따로 쓰면 반드시 갈라진다.

/** 실제로 낼 금액 — 총액에서 사용 포인트를 뺀 값. 저장하지 않고 항상 여기서 만든다 */
export function payableAmount(totalAmount: number, usedPoint: number): number {
  return Math.max(0, totalAmount - usedPoint)
}

/** 1,200 → "1,200P" */
export function formatPoint(point: number): string {
  return `${point.toLocaleString('ko-KR')}P`
}

/** 9800 → "9,800원" */
export function formatWon(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`
}

/**
 * 이번 신청에 쓸 수 있는 포인트 — 잔액과 총액 중 작은 값.
 * 화면 미리보기용이고, 실제 사용액은 서버가 같은 규칙으로 다시 정한다.
 */
export function usablePoint(balance: number, totalAmount: number): number {
  return Math.max(0, Math.min(balance, totalAmount))
}
