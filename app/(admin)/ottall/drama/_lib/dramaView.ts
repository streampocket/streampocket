import { getTodayStringKST } from '@/lib/utils'
import type {
  DecoratedAccount,
  DecoratedMember,
  DramaAccount,
  DramaMember,
  MemoLine,
} from '../_types'

// 화면에 그릴 줄과 검색 대상을 여기 한 곳에서 만든다.
// 카드·목록 펼침·검색이 모두 같은 값을 쓰므로 "보이는 것 = 검색되는 것"이 구조적으로 보장된다.

/** 만료가 임박했다고 표시할 기준(일) */
export const MEMBER_SOON_DAYS = 3
/** 멤버십 마감이 임박했다고 표시할 기준(일) */
export const DUE_SOON_DAYS = 7

/** 'YYYY-MM-DD' 두 값의 일수 차 — 둘 다 KST 벽시계 날짜라 문자열만으로 계산할 수 있다 */
function daysBetween(fromYmd: string, toYmd: string): number {
  const from = Date.parse(`${fromYmd}T00:00:00Z`)
  const to = Date.parse(`${toYmd}T00:00:00Z`)
  return Math.round((to - from) / 86_400_000)
}

/** 메모 원문의 사이트+이름 표기 — "중고나라#7561308"처럼 공백 없이 붙는 경우가 있다 */
export function formatWho(member: Pick<DramaMember, 'site' | 'name' | 'siteSpaced'>): string {
  if (!member.site) return member.name
  return `${member.site}${member.siteSpaced ? ' ' : ''}${member.name}`
}

/** 파티원 한 줄을 메모 원문 그대로 만든다 */
export function formatMemberLine(member: DramaMember): string {
  const date = member.endDate.replace(/-/g, '.')
  return `(${formatWho(member)} - ${date}/${member.startTime} ${member.days}일)${member.suffix ?? ''}`
}

/** 헤더 한 줄 — 멤버십이 열려 있을 때만 존재한다 */
export function formatHeadLine(account: DramaAccount): string | null {
  if (!account.platform || !account.dueAt) return null
  return `[${account.dueAt}]-${account.platform}${account.capacityLabel ? ` ${account.capacityLabel}` : ''}`
}

/** 공백 개수 차이로 못 찾는 일이 없게 검색어와 본문을 같은 방식으로 정규화한다 */
export const normalize = (value: string): string => value.replace(/\s+/g, ' ').trim().toLowerCase()

function buildLines(account: DramaAccount, members: DecoratedMember[], free: number): MemoLine[] {
  const lines: MemoLine[] = []
  const head = formatHeadLine(account)
  if (head) lines.push({ text: head, kind: 'head' })

  lines.push({ text: account.email, kind: 'credential', copyLabel: '아이디' })
  lines.push({ text: account.password, kind: 'credential', copyLabel: '비밀번호' })
  lines.push({ text: account.otpSecret, kind: 'credential', copyLabel: 'OTP 시크릿' })

  for (const member of members) {
    lines.push({ text: formatMemberLine(member), kind: 'member', member })
  }
  for (const note of account.notes) {
    lines.push({ text: note, kind: 'note' })
  }
  // 빈자리를 줄로 보여주면 "몇 명 더 받을 수 있나"가 숫자 계산 없이 바로 읽힌다
  for (let i = 0; i < free; i += 1) {
    lines.push({ text: '(빈자리)', kind: 'free' })
  }
  return lines
}

export function decorateAccount(account: DramaAccount, today = getTodayStringKST()): DecoratedAccount {
  const opened = account.platform !== null

  const members: DecoratedMember[] = account.members.map((member) => {
    const daysLeft = daysBetween(today, member.endDate)
    return {
      ...member,
      daysLeft,
      expired: daysLeft < 0,
      soon: daysLeft >= 0 && daysLeft <= MEMBER_SOON_DAYS,
    }
  })

  const alive = members.filter((m) => !m.expired).length
  const free = opened ? Math.max(0, (account.capacity ?? 0) - alive) : 0
  const dueLeft = opened && account.dueAt ? daysBetween(today, account.dueAt) : null
  const lines = buildLines(account, members, free)

  return {
    ...account,
    opened,
    members,
    alive,
    free,
    dueLeft,
    duePassed: dueLeft !== null && dueLeft < 0,
    dueSoon: dueLeft !== null && dueLeft >= 0 && dueLeft <= DUE_SOON_DAYS,
    expiredCount: members.filter((m) => m.expired).length,
    soonCount: members.filter((m) => m.soon).length,
    slotState: !opened ? 'none' : free > 0 ? 'free' : 'full',
    lines,
    searchText: normalize(lines.map((line) => line.text).join(' \n ')),
  }
}

export function decorateAccounts(accounts: DramaAccount[]): DecoratedAccount[] {
  const today = getTodayStringKST()
  return accounts.map((account) => decorateAccount(account, today))
}

/**
 * 카드에 보이는 메모를 편집용 텍스트로 되돌린다.
 * `(빈자리)`는 화면에서 계산해 보여주는 줄이라 메모 원문에는 없으므로 뺀다.
 */
export function toMemoText(account: DecoratedAccount): string {
  return account.lines
    .filter((line) => line.kind !== 'free')
    .map((line) => line.text)
    .join('\n')
}

/** 등록된 값에서 플랫폼 목록을 모은다 — 마스터 테이블이 없어 새 값이 자동으로 필터에 나타난다 */
export function collectPlatforms(accounts: DecoratedAccount[]): string[] {
  const values = accounts.map((a) => a.platform).filter((p): p is string => Boolean(p))
  return Array.from(new Set(values)).sort()
}

export function collectSites(accounts: DecoratedAccount[]): string[] {
  const values = accounts.flatMap((a) =>
    a.members.map((m) => m.site).filter((s): s is string => Boolean(s)),
  )
  return Array.from(new Set(values)).sort()
}
