export type DramaMember = {
  id: string
  /** 신청 사이트. 카카오톡 닉네임만 적힌 파티원은 null */
  site: string | null
  name: string
  /** 사이트와 이름 사이 공백 유무 — "중고나라#7561308"처럼 붙여 쓴 원문 재현용 */
  siteSpaced: boolean
  /** 'YYYY-MM-DD' — 만료일 */
  endDate: string
  /** 'HH:mm' — 시작 시각이자 만료 시각 */
  startTime: string
  days: number
  /** 닫는 괄호 뒤 원문 꼬리 ("-갤s26" 등) */
  suffix: string | null
}

export type DramaAccount = {
  id: string
  email: string
  password: string
  otpSecret: string
  /** null이면 멤버십 미개설 (계정만 등록된 상태) */
  platform: string | null
  capacity: number | null
  /** 화면에 그대로 출력할 정원 표기 ("3인" / "프라이빗") */
  capacityLabel: string | null
  dueAt: string | null
  /** 파티원 형식이 아닌 괄호 줄 — 원문 보존 */
  notes: string[]
  members: DramaMember[]
}

/** 카드에 그릴 한 줄 = 검색 대상 한 줄. 렌더와 검색이 같은 값을 쓰게 하는 단일 소스 */
export type MemoLine = {
  text: string
  kind: 'head' | 'credential' | 'member' | 'note' | 'free'
  /** 복사 버튼 라벨 (credential일 때만) */
  copyLabel?: string
  member?: DecoratedMember
}

export type DecoratedMember = DramaMember & {
  /** 오늘 기준 남은 일수 (음수면 만료) */
  daysLeft: number
  expired: boolean
  /** 만료가 코앞 */
  soon: boolean
}

// members는 DecoratedMember로 바뀌므로 교차가 아니라 Omit으로 갈아끼운다
// (교차로 두면 원소 타입이 DramaMember로 좁혀져 daysLeft·expired를 못 읽는다)
export type DecoratedAccount = Omit<DramaAccount, 'members'> & {
  /** 멤버십이 열려 있는지 */
  opened: boolean
  members: DecoratedMember[]
  /** 만료되지 않은 파티원 수 */
  alive: number
  free: number
  dueLeft: number | null
  duePassed: boolean
  dueSoon: boolean
  expiredCount: number
  soonCount: number
  slotState: 'free' | 'full' | 'none'
  lines: MemoLine[]
  /** 소문자·공백 정규화된 전체 텍스트 — 메모장 Ctrl+F식 검색용 */
  searchText: string
}

export type FilterGroup = 'slot' | 'due' | 'mem' | 'plat' | 'site'

export type ViewMode = 'card' | 'list'

export type SortKey = 'due' | 'free' | 'memexp' | 'plat'

/** 서버 파서가 메모 한 덩어리를 읽은 결과 */
export type ParsedItem = {
  index: number
  email: string | null
  password: string | null
  otpSecret: string | null
  platform: string | null
  capacity: number | null
  capacityLabel: string | null
  dueAt: string | null
  members: Omit<DramaMember, 'id'>[]
  notes: string[]
  /** 등록 불가 */
  errors: string[]
  /** 등록은 되지만 확인하는 게 좋음 */
  warnings: string[]
}

/** 이관 미리보기 항목 — 파싱 결과에 중복 여부가 붙는다 */
export type ImportItem = ParsedItem & {
  duplicate: boolean
}

/** 계정 1건을 텍스트로 저장할 때 서버가 돌려주는 변화 요약 */
export type TextSaveDiff = {
  /** 신규 등록이면 null */
  membersBefore: number | null
  membersAfter: number
  emailBefore: string | null
  emailAfter: string
  headBefore: string | null
  headAfter: string | null
}

export type TextSaveResult = {
  dryRun: boolean
  parsed: ParsedItem
  diff: TextSaveDiff
  account?: DramaAccount
}

export type ImportResult = {
  dryRun: boolean
  items: ImportItem[]
  summary: {
    total: number
    importable: number
    duplicates: number
    errors: number
    warnings: number
    members: number
  }
  applied?: { created: number; overwritten: number; skipped: number }
}
