import * as OTPAuth from 'otpauth'

// Google Authenticator 기본값과 동일 (SHA1 · 6자리 · 30초)
export const TOTP_PERIOD = 30

// 시크릿 정규화: 공백 제거 + 대문자 (Google이 4자리씩 띄워 보여주는 경우 대비)
export function normalizeSecret(input: string): string {
  return input.replace(/\s+/g, '').toUpperCase()
}

// Base32 유효성 검증 (fromBase32는 잘못된 형식이면 throw)
export function isValidSecret(input: string): boolean {
  try {
    OTPAuth.Secret.fromBase32(normalizeSecret(input))
    return true
  } catch {
    return false
  }
}

// 현재 6자리 TOTP 코드 생성 (절대 시각 epoch 기준이라 타임존 무관)
export function generateCode(input: string): string {
  const totp = new OTPAuth.TOTP({
    secret: OTPAuth.Secret.fromBase32(normalizeSecret(input)),
    digits: 6,
    period: TOTP_PERIOD,
  })
  return totp.generate()
}

// 현재 주기에서 남은 초 (30 → 1)
export function getRemainingSeconds(): number {
  return TOTP_PERIOD - (Math.floor(Date.now() / 1000) % TOTP_PERIOD)
}
