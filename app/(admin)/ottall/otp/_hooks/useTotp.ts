import { useEffect, useState } from 'react'
import { generateCode, getRemainingSeconds, isValidSecret, TOTP_PERIOD } from '@/lib/totp'

type UseTotpResult = {
  code: string
  remaining: number
  valid: boolean
}

// 시크릿을 받아 매초 코드/남은시간을 갱신한다.
// 생성 비용이 미미해 30초 경계 분기 없이 매 tick 재계산 → 경계 버그 원천 차단.
export function useTotp(secret: string): UseTotpResult {
  const valid = secret.trim() !== '' && isValidSecret(secret)
  const [code, setCode] = useState('')
  const [remaining, setRemaining] = useState(TOTP_PERIOD)

  useEffect(() => {
    if (!valid) {
      setCode('')
      setRemaining(TOTP_PERIOD)
      return
    }

    const tick = () => {
      setCode(generateCode(secret))
      setRemaining(getRemainingSeconds())
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [secret, valid])

  return { code, remaining, valid }
}
