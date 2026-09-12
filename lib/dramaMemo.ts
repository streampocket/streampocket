import type { DramaMemoSource, MemoLine } from '@/types/domain'

/**
 * 드라마 계정 메모 원문을 만드는 형식 함수 — **이 파일이 단일 소스다.**
 *
 * 드라마 계정 관리(`app/(admin)/ottall/drama/_lib/dramaView.ts`)와 신청 관리·주문 관리가
 * 같은 계정을 열었을 때 **글자까지 같은 메모**가 나와야 한다. 그래서 형식을 만드는 함수는
 * 복사하지 않고 여기 한 곳에 둔다. 드라마 쪽은 이 파일에서 가져다 쓴다.
 *
 * 파라미터를 좁은 구조 타입으로 받는 이유: 드라마 페이지의 `DramaMember`·`DramaAccount`·
 * `DecoratedMember`가 타입 이동 없이 구조적으로 그대로 들어맞게 하기 위함이다.
 */

/** 괄호 줄을 만드는 데 필요한 최소 필드 */
type MemoMemberFields = {
  site: string | null
  name: string
  siteSpaced: boolean
  /** 'YYYY-MM-DD' */
  endDate: string
  /** 'HH:mm' */
  startTime: string
  days: number
  suffix: string | null
}

/** 헤더 줄을 만드는 데 필요한 최소 필드 */
type MemoHeadFields = {
  platform: string | null
  capacityLabel: string | null
  /** 'YYYY-MM-DD' */
  dueAt: string | null
}

/**
 * 파티원의 만료 시각(epoch ms).
 *
 * 메모의 `2026.08.05/01:30`에서 시각이 곧 만료 시각이다 — 날짜만 보면
 * 01:30에 끝난 자리가 그날 하루 종일 차 있는 것으로 잡혀 빈자리를 늦게 발견한다.
 * 두 값 모두 KST 벽시계라 오프셋을 +09:00으로 명시한다 (브라우저 로컬 존으로 해석되면 몇 시간씩 어긋난다).
 */
export function memberExpiresAt(member: Pick<MemoMemberFields, 'endDate' | 'startTime'>): number {
  return Date.parse(`${member.endDate}T${member.startTime}:00+09:00`)
}

/** 메모 원문의 사이트+이름 표기 — "중고나라#7561308"처럼 공백 없이 붙는 경우가 있다 */
export function formatWho(member: Pick<MemoMemberFields, 'site' | 'name' | 'siteSpaced'>): string {
  if (!member.site) return member.name
  return `${member.site}${member.siteSpaced ? ' ' : ''}${member.name}`
}

/** 파티원 한 줄을 메모 원문 그대로 만든다 */
export function formatMemberLine(member: MemoMemberFields): string {
  const date = member.endDate.replace(/-/g, '.')
  return `(${formatWho(member)} - ${date}/${member.startTime} ${member.days}일)${member.suffix ?? ''}`
}

/** 헤더 한 줄 — 멤버십이 열려 있을 때만 존재한다 */
export function formatHeadLine(account: MemoHeadFields): string | null {
  if (!account.platform || !account.dueAt) return null
  return `[${account.dueAt}]-${account.platform}${account.capacityLabel ? ` ${account.capacityLabel}` : ''}`
}

/**
 * 메모 줄 배열을 만든다 — 신청 관리·주문 관리가 쓴다.
 *
 * ⚠️ **줄 순서는 드라마 계정 관리의 `dramaView.buildLines`와 같아야 한다.**
 * 그쪽은 줄마다 `DecoratedMember` 전체(임박 배지·삭제 버튼용)를 달아야 해서 조립을 따로 하지만,
 * **순서가 어긋나면 같은 계정이 두 화면에서 다르게 보인다.** 한쪽을 바꾸면 다른 쪽도 바꿀 것.
 *
 * 드라마 쪽과 달리 `member`에는 강조·취소선 판정에 필요한 최소 정보만 담는다.
 */
export function buildMemoLines(source: DramaMemoSource, now = Date.now()): MemoLine[] {
  const lines: MemoLine[] = []

  const head = formatHeadLine(source)
  if (head) lines.push({ text: head, kind: 'head' })

  lines.push({ text: source.email, kind: 'credential' })
  lines.push({ text: source.password, kind: 'credential' })
  lines.push({ text: source.otpSecret, kind: 'otp' })

  let alive = 0
  for (const member of source.members) {
    const expired = memberExpiresAt(member) - now <= 0
    if (!expired) alive += 1
    lines.push({
      text: formatMemberLine(member),
      kind: 'member',
      member: { id: member.id, expired },
    })
  }

  // 파티원 형식이 아닌 괄호 줄 — 원문 그대로 보존된 값이다
  for (const note of source.notes) {
    lines.push({ text: note, kind: 'note' })
  }

  // 빈자리를 줄로 보여주면 "몇 명 더 받을 수 있나"가 숫자 계산 없이 바로 읽힌다.
  // 멤버십 미개설(platform null)이면 정원 개념이 없어 0으로 둔다.
  const opened = source.platform !== null
  const free = opened ? Math.max(0, (source.capacity ?? 0) - alive) : 0
  for (let i = 0; i < free; i += 1) {
    lines.push({ text: '(빈자리)', kind: 'free' })
  }

  return lines
}
