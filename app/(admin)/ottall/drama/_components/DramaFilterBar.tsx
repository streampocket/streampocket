'use client'

import { cn } from '@/lib/utils'
import type { DecoratedAccount, FilterGroup } from '../_types'

export type FilterOption = {
  value: string
  label: string
  test: (account: DecoratedAccount) => boolean
}

export type FilterDefs = Record<FilterGroup, FilterOption[]>

type DramaFilterBarProps = {
  filters: FilterDefs
  active: Record<FilterGroup, Set<string>>
  accounts: DecoratedAccount[]
  /** 특정 그룹을 뺀 나머지 조건만 적용해봤을 때 통과하는지 (칩 옆 개수 계산용) */
  passesExcept: (account: DecoratedAccount, skip: FilterGroup) => boolean
  query: string
  onToggle: (group: FilterGroup, value: string) => void
  onQueryChange: (value: string) => void
  onReset: () => void
}

const GROUP_LABELS: Record<FilterGroup, string> = {
  slot: '자리',
  due: '멤버십',
  mem: '파티원',
  plat: '플랫폼',
  site: '사이트',
}

const GROUP_ORDER: FilterGroup[] = ['slot', 'due', 'mem', 'plat', 'site']

export function DramaFilterBar({
  filters,
  active,
  accounts,
  passesExcept,
  query,
  onToggle,
  onQueryChange,
  onReset,
}: DramaFilterBarProps) {
  return (
    <div className="border-border bg-card-bg flex flex-col gap-2.5 rounded-xl border p-4">
      {GROUP_ORDER.map((group) => (
        <div key={group} className="flex flex-wrap items-center gap-1.5">
          <span className="text-text-muted text-caption-sm w-full shrink-0 font-semibold md:w-[58px]">
            {GROUP_LABELS[group]}
          </span>
          {filters[group].map((option) => {
            // 다른 필터가 걸린 상태에서 이 칩을 누르면 몇 건이 남는지 미리 보여준다
            const count = accounts.filter((a) => passesExcept(a, group) && option.test(a)).length
            const isOn = active[group].has(option.value)
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isOn}
                onClick={() => onToggle(group, option.value)}
                className={cn(
                  'text-caption-md cursor-pointer rounded-lg px-3 py-1.5 font-semibold transition-colors',
                  isOn ? 'bg-brand text-white' : 'bg-gray-100 text-text-secondary hover:bg-gray-200',
                  count === 0 && !isOn && 'opacity-40',
                )}
              >
                {option.label}
                <span className={cn('ml-1 tabular-nums', isOn ? 'opacity-80' : 'opacity-65')}>{count}</span>
              </button>
            )
          })}
          {filters[group].length === 0 && (
            <span className="text-text-muted text-caption-md">등록된 값이 없습니다</span>
          )}
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-text-muted text-caption-sm w-full shrink-0 font-semibold md:w-[58px]">검색</span>
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="메모에 보이는 아무 글자나 — 예: -07-23]-비글 3인 · 갤s26 · 중고나라#7561308"
          className="text-body-md border-border focus:border-brand min-w-[160px] flex-1 rounded-lg border px-3 py-1.5 outline-none"
        />
        <button
          type="button"
          onClick={onReset}
          className="text-text-secondary hover:text-text-primary text-caption-md ml-auto cursor-pointer px-1.5 py-1"
        >
          ↺ 전체 초기화
        </button>
      </div>
    </div>
  )
}
