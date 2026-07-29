'use client'

import { useEffect, useState } from 'react'
import type { FilterGroup, SortKey, ViewMode } from '../_types'

/**
 * 검색·필터·정렬·보기 모드를 sessionStorage에 담아 페이지를 오가도 그대로 두는 훅.
 *
 * 계정을 하나 고치러 다른 메뉴에 갔다 오면 조건이 풀려 처음부터 다시 좁혀야 했다.
 * 초기화는 「전체 초기화」를 눌렀을 때만 일어나고, 탭을 닫으면 자연히 비워진다
 * (localStorage로 두면 다음 날 어제 필터가 남아 "계정이 안 보인다"가 된다).
 */
const STORAGE_KEY = 'streampocket.drama.view'

export const DEFAULT_SORT: SortKey = 'dueAsc'

const FILTER_GROUPS: FilterGroup[] = ['slot', 'due', 'mem', 'plat', 'site']

export type DramaViewState = {
  active: Record<FilterGroup, Set<string>>
  query: string
  sortBy: SortKey
  view: ViewMode
}

export const emptyActive = (): Record<FilterGroup, Set<string>> => ({
  slot: new Set(),
  due: new Set(),
  mem: new Set(),
  plat: new Set(),
  site: new Set(),
})

const initialState = (): DramaViewState => ({
  active: emptyActive(),
  query: '',
  sortBy: DEFAULT_SORT,
  view: 'card',
})

/** Set은 JSON으로 직렬화되지 않으므로 배열로 바꿔 저장한다 */
type StoredState = {
  active: Record<string, string[]>
  query: string
  sortBy: string
  view: string
}

function toStored(state: DramaViewState): StoredState {
  const active: Record<string, string[]> = {}
  for (const group of FILTER_GROUPS) active[group] = Array.from(state.active[group])
  return { active, query: state.query, sortBy: state.sortBy, view: state.view }
}

const isSortKey = (value: unknown): value is SortKey =>
  value === 'dueAsc' || value === 'dueDesc' || value === 'free' || value === 'memexp' || value === 'plat'

const isViewMode = (value: unknown): value is ViewMode => value === 'card' || value === 'list'

/**
 * 저장된 값을 되살린다. 형식이 깨졌거나 예전 버전이면 기본값으로 돌아간다 —
 * 관리자 화면이 저장값 때문에 못 뜨는 일이 없어야 한다.
 * 지금 데이터에 없는 플랫폼·사이트가 남아 있어도 무해하다 (그 칩이 0건일 뿐).
 */
function fromStored(raw: string): DramaViewState | null {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return null
    const stored = parsed as Partial<StoredState>

    const active = emptyActive()
    if (typeof stored.active === 'object' && stored.active !== null) {
      for (const group of FILTER_GROUPS) {
        const values = stored.active[group]
        if (Array.isArray(values)) {
          active[group] = new Set(values.filter((v): v is string => typeof v === 'string'))
        }
      }
    }

    return {
      active,
      query: typeof stored.query === 'string' ? stored.query : '',
      sortBy: isSortKey(stored.sortBy) ? stored.sortBy : DEFAULT_SORT,
      view: isViewMode(stored.view) ? stored.view : 'card',
    }
  } catch {
    return null
  }
}

export function useDramaViewState() {
  // 복원은 첫 렌더가 아니라 useEffect에서 한다 —
  // 초기값에서 읽으면 서버가 그린 HTML과 값이 달라 하이드레이션이 깨진다.
  const [state, setState] = useState<DramaViewState>(initialState)
  const [restored, setRestored] = useState(false)

  useEffect(() => {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    const saved = raw ? fromStored(raw) : null
    if (saved) setState(saved)
    setRestored(true)
  }, [])

  useEffect(() => {
    // 복원 전에 쓰면 기본값이 저장값을 덮어쓴다
    if (!restored) return
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(toStored(state)))
  }, [state, restored])

  const toggleFilter = (group: FilterGroup, value: string) => {
    setState((prev) => {
      const next = new Set(prev.active[group])
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return { ...prev, active: { ...prev.active, [group]: next } }
    })
  }

  const setQuery = (query: string) => setState((prev) => ({ ...prev, query }))
  const setSortBy = (sortBy: SortKey) => setState((prev) => ({ ...prev, sortBy }))
  const setView = (view: ViewMode) => setState((prev) => ({ ...prev, view }))

  /**
   * 「전체 초기화」 — 저장된 조건을 비우는 유일한 경로.
   * 보기 모드(카드/목록)는 조건이 아니라 취향이라 그대로 둔다.
   */
  const resetAll = () =>
    setState((prev) => ({ ...initialState(), view: prev.view }))

  return { ...state, toggleFilter, setQuery, setSortBy, setView, resetAll }
}
