export function isAaProduct(productName: string): boolean {
  return / AA$/i.test(productName.trim())
}

const REVIEW_GAME_PATTERN = /(\d+)\s*\+\s*(\d+)/

/** 상품명에서 리뷰게임 발송 개수를 추출 (예: "게임 1+3" → 3). 패턴이 없으면 null */
export function parseReviewGameCount(productName: string): number | null {
  const match = productName.match(REVIEW_GAME_PATTERN)
  if (!match) return null
  const count = Number(match[2])
  return count > 0 ? count : null
}
