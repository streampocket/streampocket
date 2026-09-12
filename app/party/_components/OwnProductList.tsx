'use client'

import { useState } from 'react'
import { OwnProductCard } from './OwnProductCard'
import { SortDropdown } from './SortDropdown'
import { useOwnProducts } from '../_hooks/useOwnProducts'
import { useOwnCategories } from '../_hooks/useOwnCategories'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { OTT_CATALOG } from '@/constants/ottCatalog'
import type { OwnCategory, OwnProduct } from '@/types/domain'
import type { ProductSort } from '../_types'

type DurationFilterValue = 'all' | '1-7' | '8-14' | '15-29' | '30+'

// 사용기간(durationDays) 구간 필터 — 정확히 30일 파티는 '30일~'에 포함
const DURATION_FILTERS: {
  value: DurationFilterValue
  label: string
  min: number
  max: number
}[] = [
  { value: 'all', label: '전체 기간', min: 0, max: Infinity },
  { value: '1-7', label: '1~7일', min: 1, max: 7 },
  { value: '8-14', label: '8~14일', min: 8, max: 14 },
  { value: '15-29', label: '15~29일', min: 15, max: 29 },
  { value: '30+', label: '30일~', min: 30, max: Infinity },
]

// 필터 기준 기간 — 지금 참여하면 실제로 이용하게 될 일수.
// 개인형·유지형은 참여 시점부터 전체 기간 보장, 차감형은 시작 후 남은 기간만 이용 가능
function effectiveDurationDays(p: OwnProduct): number {
  const isPerMemberPeriod = p.partyType === 'personal' || p.durationMode === 'fixed'
  if (isPerMemberPeriod || !p.startedAt) return p.durationDays
  return p.remainingDays
}

const chipClass = (active: boolean): string =>
  cn(
    'rounded-full px-4 py-1.5 text-body-md font-medium transition-colors',
    active ? 'bg-brand text-white' : 'bg-gray-100 text-text-secondary hover:bg-gray-200',
  )

type OwnProductListProps = {
  /** 서버에서 미리 받은 "필터 없는 모집중" 목록 — 크롤러가 받는 HTML에 링크를 심는다 */
  initialProducts?: OwnProduct[]
  initialCategories?: OwnCategory[]
}

export function OwnProductList({ initialProducts, initialCategories }: OwnProductListProps = {}) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>()
  const [sort, setSort] = useState<ProductSort | undefined>()
  const [durationFilter, setDurationFilter] = useState<DurationFilterValue>('all')
  // 유저 목록은 모집중만 노출한다 — 마감·만료 파티는 상세 직접 링크(구매 기록·관리자 ↗)로만 접근
  const { data: products, isLoading: productsLoading } = useOwnProducts(
    {
      categoryId: selectedCategoryId,
      status: 'recruiting',
      sort,
    },
    initialProducts,
  )
  const { data: categories } = useOwnCategories(initialCategories)

  // 기간 필터는 목록이 전체 로드라 클라이언트에서 적용 (서버 필터 결과에 조건만 추가)
  const durationRange = DURATION_FILTERS.find((f) => f.value === durationFilter)
  const filteredProducts =
    durationFilter === 'all' || !durationRange
      ? products
      : products?.filter((p) => {
          const days = effectiveDurationDays(p)
          return days >= durationRange.min && days <= durationRange.max
        })

  const isFilterChanged =
    selectedCategoryId !== undefined || sort !== undefined || durationFilter !== 'all'

  function resetFilters() {
    setSelectedCategoryId(undefined)
    setSort(undefined)
    setDurationFilter('all')
  }

  return (
    <div className="space-y-6">
      {/* 헤더 — 소개 문구는 "숏폼 드라마" 검색 노출용 텍스트를 겸한다 */}
      <div>
        <h1 className="text-heading-lg text-text-primary">파티 모집</h1>
        <p className="mt-1 text-body-md text-text-secondary">
          숏폼 드라마 · OTT 공동구매 파티 — 드라마박스(Dramabox), 릴숏(Reelshort) 등을 함께
          저렴하게 이용하세요.
        </p>
      </div>

      {/* 카테고리 필터 + 정렬 (상태 탭 없음 — 모집중만 노출) */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategoryId(undefined)}
            className={chipClass(selectedCategoryId === undefined)}
          >
            전체
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategoryId(cat.id)}
              className={chipClass(selectedCategoryId === cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <SortDropdown value={sort} onChange={setSort} />
      </div>

      {/* 기간 필터 + 전체 초기화 */}
      <div className="flex flex-wrap items-center gap-2">
        {DURATION_FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setDurationFilter(filter.value)}
            className={chipClass(durationFilter === filter.value)}
          >
            {filter.label}
          </button>
        ))}
        {isFilterChanged && (
          <button
            type="button"
            onClick={resetFilters}
            className="ml-auto shrink-0 rounded-full px-3 py-1.5 text-body-md font-medium text-text-muted transition-colors hover:bg-gray-100 hover:text-text-primary"
          >
            ↺ 필터 초기화
          </button>
        )}
      </div>

      {/* 파티 그리드 */}
      {productsLoading ? (
        <div className="py-20 text-center text-text-muted">파티를 불러오는 중...</div>
      ) : filteredProducts && filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <OwnProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-text-muted">
          {isFilterChanged ? '조건에 맞는 파티가 없습니다.' : '등록된 파티가 없습니다.'}
        </div>
      )}

      {/* OTT별 대표 페이지 링크 — 크롤러가 랜딩으로 들어가는 내부 경로이자,
          사용자가 특정 OTT의 소개·후기를 모아 보는 입구다.
          목록 위가 아니라 아래에 두는 이유: 위에 두면 바로 아래 카테고리 필터 칩과
          모양·이름이 같아 "필터"로 오해된다 (카테고리는 파티명으로 자동 생성돼 OTT명과 겹친다).
          단, 위 3분기(로딩·목록·빈 목록) 바깥에 둬야 모집중이 0이어도 링크가 남는다 —
          이 링크는 검색 크롤러가 랜딩 7개로 들어가는 경로를 겸하기 때문이다.
          pb-16: 페이지 최하단이라 카카오 문의 플로팅 버튼(fixed bottom-6 right-6, 56px)이
          마지막 줄 pill을 덮는다. 그만큼 아래 여백을 줘 탭 영역이 가리지 않게 한다. */}
      <nav aria-label="OTT별 보기" className="border-t border-border pb-16 pt-6">
        <span className="text-body-md text-text-secondary">OTT별로 보기</span>
        <p className="mt-1 text-caption-md text-text-muted">
          OTT별 페이지에서 소개와 이용 후기까지 모아 볼 수 있습니다.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {OTT_CATALOG.map((ott) => (
            <Link
              key={ott.slug}
              href={`/ott/${ott.slug}`}
              className="rounded-full bg-gray-100 px-3 py-1 text-caption-md font-medium text-text-secondary transition-colors hover:bg-gray-200"
            >
              {ott.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
