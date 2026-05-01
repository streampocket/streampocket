'use client'

import { useState } from 'react'
import { useParams, useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useOwnProductDetail } from '../_hooks/useOwnProductDetail'
import { useDeleteOwnProduct } from '../_hooks/useDeleteOwnProduct'
import { useApplyParty } from '../_hooks/useApplyParty'
import { useCheckApplied } from '../_hooks/useCheckApplied'
import { ApplyCompletedModal } from './ApplyCompletedModal'
import { getUserInfo } from '@/lib/userAuth'
import { PARTY_DEFAULT_RULES, USER_LOGIN_PATH } from '@/constants/app'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import { cn } from '@/lib/utils'
import type { OwnProductStatus } from '@/types/domain'
import type { BadgeVariant } from '@/components/ui/Badge'

const STATUS_MAP: Record<OwnProductStatus, { label: string; variant: BadgeVariant }> = {
  recruiting: { label: '모집중', variant: 'green' },
  closed: { label: '닫힘', variant: 'red' },
  expired: { label: '만료', variant: 'gray' },
}

export function OwnProductDetail() {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const id = params.id as string
  const { data: product, isLoading } = useOwnProductDetail(id)
  const queryClient = useQueryClient()
  const deleteMutation = useDeleteOwnProduct()
  const applyMutation = useApplyParty(id)
  const { data: applicationCheck } = useCheckApplied(id)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [agreedToRules, setAgreedToRules] = useState(false)
  const [completedInfo, setCompletedInfo] = useState<{
    price: number
    fee: number
    totalAmount: number
  } | null>(null)

  async function handleApply() {
    try {
      const res = await applyMutation.mutateAsync()
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ownProducts.detail(id) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.partyApplications.check(id) })
      setCompletedInfo({
        price: res.data.price,
        fee: res.data.fee,
        totalAmount: res.data.totalAmount,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : '신청 처리 중 오류가 발생했습니다.'
      toast.error(message)
    }
  }

  const userInfo = getUserInfo()
  const isOwner = userInfo?.id === product?.userId
  const isClosed = product
    ? product.filledSlots >= product.totalSlots || (product.startedAt !== null && product.remainingDays <= 1)
    : false

  if (isLoading) {
    return <div className="py-20 text-center text-text-muted">파티를 불러오는 중...</div>
  }

  if (!product) {
    return <div className="py-20 text-center text-text-muted">파티를 찾을 수 없습니다.</div>
  }

  const status = STATUS_MAP[product.status]
  const progress = product.totalSlots > 0
    ? Math.round((product.filledSlots / product.totalSlots) * 100)
    : 0

  const handleDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setShowDeleteModal(false)
        router.push('/party/my')
      },
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* 뒤로가기 */}
      <Link href="/party" className="text-body-md inline-flex items-center gap-1 text-text-secondary hover:text-text-primary">
        &larr; 목록으로
      </Link>

      {/* 파티 기본 정보 */}
      <Card>
        <CardBody className="space-y-4">
          <div className="flex items-start gap-4">
            {product.imagePath ? (
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                <Image
                  src={product.imagePath}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="80px"
                />
              </div>
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-text-muted">
                <span className="text-heading-lg">?</span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-heading-lg text-text-primary">{product.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="blue">{product.category.name}</Badge>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
            </div>
          </div>

          {/* 가격/기간/인원 */}
          <div className="grid grid-cols-3 gap-3 rounded-lg bg-gray-50 p-4">
            <div className="text-center">
              <p className="text-caption-sm text-text-muted">가격</p>
              {product.currentPrice != null && product.currentPrice < product.price ? (
                <div>
                  <p className="text-caption-sm text-text-muted line-through">{product.price.toLocaleString()}원</p>
                  <p className="text-body-lg font-semibold text-brand">{product.currentPrice.toLocaleString()}원</p>
                </div>
              ) : (
                <p className="text-body-lg font-semibold text-text-primary">{product.price.toLocaleString()}원</p>
              )}
            </div>
            <div className="text-center">
              <p className="text-caption-sm text-text-muted">
                {product.startedAt ? '남은 기간' : '사용기간'}
              </p>
              <p className="text-body-lg font-semibold text-text-primary">
                {product.startedAt ? `${product.remainingDays}일` : `${product.durationDays}일`}
              </p>
            </div>
            <div className="text-center">
              <p className="text-caption-sm text-text-muted">모집인원</p>
              <p className="text-body-lg font-semibold text-text-primary">{product.filledSlots}/{product.totalSlots}명</p>
            </div>
          </div>

          {/* 시작일/종료일 */}
          <div className="grid grid-cols-2 gap-3 rounded-lg bg-gray-50 p-4">
            <div className="text-center">
              <p className="text-caption-sm text-text-muted">시작일</p>
              <p className="text-body-md font-semibold text-text-primary">
                {product.startedAt
                  ? new Date(product.startedAt).toLocaleDateString('ko-KR')
                  : '첫 파티원 참여 후 시작'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-caption-sm text-text-muted">종료일</p>
              <p className="text-body-md font-semibold text-text-primary">
                {product.partyExpiresAt
                  ? new Date(product.partyExpiresAt).toLocaleDateString('ko-KR')
                  : `첫 파티원 참여일로부터 ${product.durationDays}일`}
              </p>
            </div>
          </div>

          {/* 모집 프로그레스 */}
          <div>
            <div className="mb-1 flex items-center justify-between text-caption-sm text-text-muted">
              <span>모집 현황</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  progress >= 100 ? 'bg-gray-400' : 'bg-brand',
                )}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>

          {/* 등록자 정보 */}
          <div className="flex items-center gap-4 text-body-md text-text-secondary">
            <span>등록자: {product.user.name}</span>
            <span>등록일: {new Date(product.createdAt).toLocaleDateString('ko-KR')}</span>
          </div>
        </CardBody>
      </Card>

      {/* 파티 규칙 */}
      {product.notes && (
        <Card>
          <CardBody>
            <h2 className="text-heading-md mb-3 text-text-primary">파티 규칙</h2>
            <div className="prose prose-sm max-w-none text-text-secondary prose-headings:text-text-primary prose-strong:text-text-primary">
              <ReactMarkdown remarkPlugins={[remarkBreaks]}>{product.notes}</ReactMarkdown>
            </div>
          </CardBody>
        </Card>
      )}

      {/* 기본 규칙 (플랫폼 공통) */}
      <ul className="list-disc space-y-1 pl-5 text-body-sm text-text-muted">
        {PARTY_DEFAULT_RULES.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
      <p className="text-body-sm text-text-muted">
        자세한 환불 정책은{' '}
        <Link href="/terms" className="font-medium text-brand underline hover:text-brand-dark">
          이용약관
        </Link>
        을 확인해 주세요.
      </p>

      {/* 참여 신청 */}
      {product.status === 'recruiting' && !isOwner && (
        <div className="space-y-3">
          {applicationCheck?.applied && applicationCheck.applicationStatus === 'confirmed' ? (
            <div className="flex flex-col items-center gap-2 rounded-lg bg-green-50 p-4">
              <Badge variant="green">참여 완료</Badge>
              <p className="text-body-md text-text-secondary">
                파티 참여가 확정되었습니다.
              </p>
              <a
                href="https://pf.kakao.com/_MkxalX"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 rounded-lg bg-[#FEE500] px-4 py-2 text-body-md font-medium text-[#191919] transition-opacity hover:opacity-80"
              >
                카카오톡 문의하기
              </a>
            </div>
          ) : applicationCheck?.applied ? (
            <div className="flex flex-col items-center gap-2 rounded-lg bg-yellow-50 p-4">
              <Badge variant="yellow">결제 대기중</Badge>
              <p className="text-body-md text-text-secondary">
                입금 확인 후 참여가 확정됩니다. 문의사항은 카카오톡으로 연락주세요.
              </p>
              <a
                href="https://pf.kakao.com/_MkxalX"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 rounded-lg bg-[#FEE500] px-4 py-2 text-body-md font-medium text-[#191919] transition-opacity hover:opacity-80"
              >
                카카오톡 문의하기
              </a>
            </div>
          ) : isClosed ? (
            <div className="flex flex-col items-center gap-2 rounded-lg bg-gray-50 p-4">
              <Badge variant="gray">모집 마감</Badge>
              <p className="text-body-md text-text-secondary">
                {product.filledSlots >= product.totalSlots
                  ? '이 파티는 모집이 완료되었습니다.'
                  : '이 파티는 남은 기간이 1일 이하로 참여가 불가합니다.'}
              </p>
            </div>
          ) : (
            <>
              <label className="flex cursor-pointer items-start gap-2">
                <input
                  type="checkbox"
                  checked={agreedToRules}
                  onChange={(e) => setAgreedToRules(e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-brand focus:ring-brand"
                />
                <span className="text-body-md text-text-secondary">
                  파티 규칙을 확인했으며, 파티 규칙에 동의합니다
                </span>
              </label>
              <Button
                variant="primary"
                className="w-full"
                disabled={!agreedToRules}
                loading={applyMutation.isPending}
                onClick={() => {
                  if (!userInfo) {
                    router.push(`${USER_LOGIN_PATH}?next=${encodeURIComponent(pathname)}`)
                    return
                  }
                  handleApply()
                }}
              >
                참여 신청하기
              </Button>
            </>
          )}
        </div>
      )}

      {/* 등록자 본인 액션 */}
      {isOwner && (
        <div className="flex items-center gap-3">
          <Link href={`/party/${product.id}/edit`} className="flex-1">
            <Button variant="secondary" className="w-full">수정</Button>
          </Link>
          {product.status === 'recruiting' && (
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => setShowDeleteModal(true)}
            >
              삭제
            </Button>
          )}
        </div>
      )}

      {/* 신청 완료 모달 */}
      {completedInfo && (
        <ApplyCompletedModal
          isOpen
          onClose={() => setCompletedInfo(null)}
          price={completedInfo.price}
          fee={completedInfo.fee}
          totalAmount={completedInfo.totalAmount}
        />
      )}

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="파티 삭제"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>취소</Button>
            <Button variant="danger" loading={deleteMutation.isPending} onClick={handleDelete}>삭제</Button>
          </div>
        }
      >
        <p className="text-body-md text-text-secondary">
          이 파티를 삭제하시겠습니까? 삭제된 파티는 복구할 수 없습니다.
        </p>
      </Modal>
    </div>
  )
}
