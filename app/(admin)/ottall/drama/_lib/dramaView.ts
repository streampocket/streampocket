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

const DAY_MS = 86_400_000
const HOUR_MS = 3_600_000
const MINUTE_MS = 60_000

/**
 * 'YYYY-MM-DD' 두 값의 일수 차 — 둘 다 KST 벽시계 날짜라 문자열만으로 계산할 수 있다.
 * 멤버십 마감(dueAt)에만 쓴다. 마감일에는 시각이 없어(원문에 없다) 날짜로만 잴 수 있다.
 */
function daysBetween(fromYmd: string, toYmd: string): number {
  const from = Date.parse(`${fromYmd}T00:00:00Z`)
  const to = Date.parse(`${toYmd}T00:00:00Z`)
  return Math.round((to - from) / DAY_MS)
}

/**
 * 파티원의 만료 시각(epoch ms).
 *
 * 메모의 `2026.08.05/01:30`에서 시각이 곧 만료 시각이다 — 날짜만 보면
 * 01:30에 끝난 자리가 그날 하루 종일 차 있는 것으로 잡혀 빈자리를 늦게 발견한다.
 * 두 값 모두 KST 벽시계라 오프셋을 +09:00으로 명시한다 (브라우저 로컬 존으로 해석되면 몇 시간씩 어긋난다).
 */
export function memberExpiresAt(member: Pick<DramaMember, 'endDate' | 'startTime'>): number {
  return Date.parse(`${member.endDate}T${member.startTime}:00+09:00`)
}

/**
 * 파티원 줄에 붙일 마감 표시.
 * 24시간 이내는 남은 시간으로 보여준다 — "지금 들어갈 수 있는 자리인가"가 D-0으로는 안 읽힌다.
 */
export function formatTimeLeft(member: DecoratedMember): string | null {
  if (member.expired) return '만료'
  if (member.msLeft < HOUR_MS) return `${Math.max(1, Math.floor(member.msLeft / MINUTE_MS))}분 뒤`
  if (member.msLeft < DAY_MS) return `${Math.floor(member.msLeft / HOUR_MS)}시간 뒤`
  if (member.soon) return `D-${member.daysLeft}`
  return null
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

  lines.push({ text: account.email, kind: 'credential' })
  lines.push({ text: account.password, kind: 'credential' })
  // OTP 시크릿 줄만 따로 구분한다 — 이 줄에 「발급」 버튼이 붙는다
  lines.push({ text: account.otpSecret, kind: 'otp' })

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

export function decorateAccount(
  account: DramaAccount,
  now = Date.now(),
  today = getTodayStringKST(),
): DecoratedAccount {
  const opened = account.platform !== null

  const members: DecoratedMember[] = account.members.map((member) => {
    // 남은 시간 하나가 진실이고 만료·임박·배지·정렬이 전부 여기서 파생된다.
    // daysLeft를 달력 날짜 차이로 따로 두면 "D-1인데 30시간 남음" 같은 어긋남이 생긴다.
    const msLeft = memberExpiresAt(member) - now
    const expired = msLeft <= 0
    return {
      ...member,
      msLeft,
      daysLeft: Math.floor(msLeft / DAY_MS),
      expired,
      soon: !expired && msLeft <= MEMBER_SOON_DAYS * DAY_MS,
    }
  })

  const alive = members.filter((m) => !m.expired).length
  const free = opened ? Math.max(0, (account.capacity ?? 0) - alive) : 0
  // 멤버십 마감은 원문에 시각이 없어 날짜로만 잰다 (파티원과 달리 시각 기준이 불가능)
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
  // 기준 시각을 한 번만 잡는다 — 계정마다 다른 시각을 쓰면 목록 안에서 판정이 엇갈릴 수 있다
  const now = Date.now()
  const today = getTodayStringKST()
  return accounts.map((account) => decorateAccount(account, now, today))
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

/**
 * 여러 계정을 메모장 원문 한 덩어리로 되돌린다.
 * 계정 사이는 빈 줄 — 메모 형식에서 빈 줄이 계정 구분자라, 이 결과를 그대로
 * 「메모 붙여넣기」에 다시 넣을 수 있다 (백업 → 복원이 같은 형식으로 닫힌다).
 */
export function toMemoTextAll(accounts: DecoratedAccount[]): string {
  return accounts.map(toMemoText).join('\n\n')
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
