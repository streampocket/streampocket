'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useOwnProductDetail } from '../_hooks/useOwnProductDetail'
import { useDeleteOwnProduct } from '../_hooks/useDeleteOwnProduct'
import { getUserInfo } from '@/lib/userAuth'
import { PARTY_DEFAULT_RULES } from '@/constants/app'
import ReactMarkdown from 'react-markdown'
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
  const id = params.id as string
  const { data: product, isLoading } = useOwnProductDetail(id)
  const deleteMutation = useDeleteOwnProduct()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [agreedToRules, setAgreedToRules] = useState(false)

  const userInfo = getUserInfo()
  const isOwner = userInfo?.id === product?.userId

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
              <p className="text-caption-sm text-text-muted">인당 가격</p>
              <p className="text-body-lg font-semibold text-text-primary">인당 {product.price.toLocaleString()}원</p>
            </div>
            <div className="text-center">
              <p className="text-caption-sm text-text-muted">사용기간</p>
              <p className="text-body-lg font-semibold text-text-primary">{product.durationDays}일</p>
            </div>
            <div className="text-center">
              <p className="text-caption-sm text-text-muted">모집인원</p>
              <p className="text-body-lg font-semibold text-text-primary">{product.filledSlots}/{product.totalSlots}명</p>
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
              <ReactMarkdown>{product.notes}</ReactMarkdown>
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

      {/* 참여 신청 */}
      {product.status === 'recruiting' && !isOwner && (
        <div className="space-y-3">
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
          <Button variant="primary" className="w-full" disabled={!agreedToRules}>
            참여 신청하기 (준비 중)
          </Button>
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
