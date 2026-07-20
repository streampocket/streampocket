import type { AccountStatus } from '@/types/domain'

export type AccountListParams = {
  gameId?: string
  status?: AccountStatus | ''
}

export type BulkCreateBody = {
  gameId: string
  accounts: Array<{
    username: string
    password: string
    email: string
    emailPassword: string
    emailSiteUrl: string
    secondaryEmail?: string
    secondaryEmailPassword?: string
    secondaryEmailSiteUrl?: string
  }>
}

// 계정 등록/필터 드롭다운에 노출할 게임 타입 — AA는 계정 재고를 사용하지 않으므로 제외
export const ACCOUNT_GAME_TYPES = ['NA', 'BG'] as const
