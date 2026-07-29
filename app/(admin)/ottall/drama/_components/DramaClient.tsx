'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/ui/StatCard'
import { cn } from '@/lib/utils'
import { AccountTextModal } from './AccountTextModal'
import { DramaCard } from './DramaCard'
import { DramaFilterBar, type FilterDefs } from './DramaFilterBar'
import { DramaList } from './DramaList'
import { ExportModal } from './ExportModal'
import { ImportModal } from './ImportModal'
import { useDeleteDramaMember, useDramaAccounts } from '../_hooks/useDramaAccounts'
import { useDramaViewState } from '../_hooks/useDramaViewState'
import {
  DUE_SOON_DAYS,
  MEMBER_SOON_DAYS,
  collectPlatforms,
  collectSites,
  decorateAccounts,
  formatMemberLine,
  normalize,
} from '../_lib/dramaView'
import type { DecoratedAccount, DecoratedMember, FilterGroup, SortKey, ViewMode } from '../_types'

const SORT_LABELS: { value: SortKey; label: string }[] = [
  { value: 'dueAsc', label: '멤버십 마감 빠른순' },
  { value: 'dueDesc', label: '멤버십 마감 느린순' },
  { value: 'free', label: '빈자리 많은순' },
  { value: 'memexp', label: '파티원 만료 임박순' },
  { value: 'plat', label: '플랫폼순' },
]

/** 마감일이 없는(미개설) 계정을 밀어 둘 자리 — 정렬 방향과 무관하게 항상 맨 뒤여야 한다 */
const NO_DUE = 99999

// 수정·파티원 추가·신규 등록이 전부 같은 텍스트 편집기다 — 시작 상태(mode)만 다르다
type ModalState =
  | { kind: 'none' }
  | { kind: 'import' }
  | { kind: 'export' }
  | { kind: 'text'; account: DecoratedAccount | null }

export function DramaClient() {
  const { data, isLoading, isError } = useDramaAccounts()
  // 검색·필터·정렬·보기 모드는 페이지를 오가도 유지된다 (sessionStorage)
  const { active, query, sortBy, view, toggleFilter, setQuery, setSortBy, setView, resetAll } =
    useDramaViewState()
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [modal, setModal] = useState<ModalState>({ kind: 'none' })

  const deleteMember = useDeleteDramaMember()

  const accounts = useMemo(() => decorateAccounts(data ?? []), [data])
  const platforms = useMemo(() => collectPlatforms(accounts), [accounts])
  const sites = useMemo(() => collectSites(accounts), [accounts])

  // 플랫폼·사이트는 등록된 값에서 만들어지므로 새 값이 들어오면 칩도 자동으로 늘어난다
  const filters = useMemo<FilterDefs>(
    () => ({
      slot: [
        { value: 'free', label: '빈자리 있음', test: (a) => a.slotState === 'free' },
        { value: 'full', label: '정원 마감', test: (a) => a.slotState === 'full' },
        { value: 'none', label: '미개설', test: (a) => a.slotState === 'none' },
      ],
      due: [
        { value: 'soon', label: '임박', test: (a) => a.dueSoon },
        { value: 'passed', label: '마감', test: (a) => a.duePassed },
        { value: 'open', label: '여유', test: (a) => a.opened && !a.dueSoon && !a.duePassed },
      ],
      mem: [
        { value: 'expired', label: '만료 있음', test: (a) => a.expiredCount > 0 },
        { value: 'soon', label: '만료 임박', test: (a) => a.soonCount > 0 },
        { value: 'empty', label: '파티원 없음', test: (a) => a.opened && a.alive === 0 },
        { value: 'nosite', label: '사이트 미지정', test: (a) => a.members.some((m) => !m.site && !m.expired) },
      ],
      plat: platforms.map((p) => ({ value: p, label: p, test: (a: DecoratedAccount) => a.platform === p })),
      site: sites.map((s) => ({
        value: s,
        label: s,
        test: (a: DecoratedAccount) => a.members.some((m) => !m.expired && m.site === s),
      })),
    }),
    [platforms, sites],
  )

  const normalizedQuery = useMemo(() => normalize(query), [query])

  /** 특정 그룹을 제외하고 나머지 조건만 적용한다 — 칩 옆 개수를 계산할 때 쓴다 */
  const passesExcept = useMemo(
    () => (account: DecoratedAccount, skip: FilterGroup | null) => {
      for (const group of Object.keys(filters) as FilterGroup[]) {
        if (group === skip || active[group].size === 0) continue
        // 같은 그룹 안은 OR, 그룹끼리는 AND
        const matched = filters[group].some((f) => active[group].has(f.value) && f.test(account))
        if (!matched) return false
      }
      if (normalizedQuery && !account.searchText.includes(normalizedQuery)) return false
      return true
    },
    [filters, active, normalizedQuery],
  )

  const visible = useMemo(() => {
    const sortKey: Record<SortKey, (a: DecoratedAccount) => number> = {
      dueAsc: (a) => (a.opened && a.dueLeft !== null ? a.dueLeft : NO_DUE),
      // 느린순은 부호를 뒤집는다. 미개설은 뒤집기 전에 걸러 양쪽 모두 맨 뒤로 보낸다
      dueDesc: (a) => (a.opened && a.dueLeft !== null ? -a.dueLeft : NO_DUE),
      free: (a) => -a.free,
      memexp: (a) => (a.members.length > 0 ? Math.min(...a.members.map((m) => m.daysLeft)) : NO_DUE),
      plat: (a) => (a.platform ? platforms.indexOf(a.platform) : 99),
    }
    const key = sortKey[sortBy]
    return accounts
      .filter((a) => passesExcept(a, null))
      .sort((x, y) => key(x) - key(y) || x.email.localeCompare(y.email))
  }, [accounts, passesExcept, sortBy, platforms])

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleDeleteMember = (account: DecoratedAccount, member: DecoratedMember) => {
    if (!window.confirm(`파티원을 지웁니다.\n\n${formatMemberLine(member)}\n\n계속할까요?`)) return
    deleteMember.mutate(
      { accountId: account.id, memberId: member.id },
      {
        onSuccess: () => toast.success('파티원이 삭제되었습니다.'),
        onError: (e) => toast.error(e instanceof Error ? e.message : '삭제에 실패했습니다.'),
      },
    )
  }

  const freeSeats = accounts.reduce((sum, a) => sum + a.free, 0)
  const expiredMembers = accounts.reduce((sum, a) => sum + a.expiredCount, 0)
  const dueSoonCount = accounts.filter((a) => a.dueSoon || a.duePassed).length

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-heading-md text-text-primary">드라마 계정 관리</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setModal({ kind: 'export' })}
            disabled={accounts.length === 0}
          >
            메모로 추출
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setModal({ kind: 'import' })}>
            ＋ 메모 붙여넣기
          </Button>
          <Button size="sm" onClick={() => setModal({ kind: 'text', account: null })}>
            ＋ 계정 등록
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="전체 계정"
          value={accounts.length}
          sub={`멤버십 열림 ${accounts.filter((a) => a.opened).length} · 미개설 ${accounts.filter((a) => !a.opened).length}`}
          icon="🎬"
        />
        <StatCard
          label="남은 빈자리"
          value={freeSeats}
          sub={`계정 ${accounts.filter((a) => a.free > 0).length}개에 여유`}
          icon="🪑"
        />
        <StatCard label="멤버십 마감·임박" value={dueSoonCount} sub={`${DUE_SOON_DAYS}일 이내 또는 이미 마감`} icon="⏳" />
        <StatCard label="만료된 파티원" value={expiredMembers} sub={`${MEMBER_SOON_DAYS}일 이내 임박은 D- 표시`} icon="🧹" />
      </div>

      <DramaFilterBar
        filters={filters}
        active={active}
        accounts={accounts}
        passesExcept={(a, skip) => passesExcept(a, skip)}
        query={query}
        onToggle={toggleFilter}
        onQueryChange={setQuery}
        onReset={resetAll}
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-caption-md text-text-secondary">
          <b className="text-text-primary tabular-nums">{visible.length}</b>개 계정 · 빈자리{' '}
          <b className="text-text-primary tabular-nums">{visible.reduce((s, a) => s + a.free, 0)}</b>석
          {query && (
            <>
              {' · '}
              <b className="text-text-primary">“{query}”</b> 포함
            </>
          )}
        </span>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="border-border flex overflow-hidden rounded-lg border">
            {(['card', 'list'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setView(mode)}
                className={cn(
                  'text-caption-md cursor-pointer px-3 py-1.5 font-semibold transition-colors',
                  view === mode ? 'bg-brand text-white' : 'bg-card-bg text-text-secondary hover:bg-gray-100',
                )}
              >
                {mode === 'card' ? '카드' : '목록'}
              </button>
            ))}
          </div>
          <label className="text-caption-md text-text-secondary flex items-center gap-1.5">
            정렬
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="border-border text-caption-md rounded-lg border px-2 py-1.5 outline-none"
            >
              {SORT_LABELS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {isLoading && <div className="text-text-secondary py-16 text-center">계정을 불러오는 중...</div>}
      {isError && <div className="text-danger py-16 text-center">계정을 불러오지 못했습니다.</div>}

      {!isLoading && !isError && visible.length === 0 && (
        <div className="border-border bg-card-bg text-text-secondary rounded-xl border border-dashed py-16 text-center">
          조건에 맞는 계정이 없습니다.
          <br />
          필터를 줄여보세요.
        </div>
      )}

      {!isLoading && !isError && visible.length > 0 && view === 'card' && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
          {visible.map((account) => (
            <DramaCard
              key={account.id}
              account={account}
              query={query}
              onEdit={(a) => setModal({ kind: 'text', account: a })}
              onDeleteMember={handleDeleteMember}
            />
          ))}
        </div>
      )}

      {!isLoading && !isError && visible.length > 0 && view === 'list' && (
        <DramaList
          accounts={visible}
          query={query}
          expanded={expanded}
          onToggle={toggleExpanded}
          onEdit={(a) => setModal({ kind: 'text', account: a })}
          onDeleteMember={handleDeleteMember}
        />
      )}

      {modal.kind === 'import' && <ImportModal onClose={() => setModal({ kind: 'none' })} />}
      {modal.kind === 'export' && (
        <ExportModal visible={visible} all={accounts} onClose={() => setModal({ kind: 'none' })} />
      )}
      {modal.kind === 'text' && (
        <AccountTextModal account={modal.account} onClose={() => setModal({ kind: 'none' })} />
      )}
    </div>
  )
}
