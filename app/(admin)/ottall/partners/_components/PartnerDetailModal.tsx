'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAdminPartnerDetail } from '../_hooks/useAdminPartnerDetail'
import { useDeletePartner } from '../_hooks/useDeletePartner'
import { useAdminDeleteProduct } from '../_hooks/useAdminDeleteProduct'

type PartnerDetailModalProps = {
  partnerId: string | null
  onClose: () => void
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR')
}

export function PartnerDetailModal({ partnerId, onClose }: PartnerDetailModalProps) {
  const { data, isLoading } = useAdminPartnerDetail(partnerId)
  const deleteMutation = useDeletePartner()
  const deleteProductMutation = useAdminDeleteProduct()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null)

  const handleDeletePartner = () => {
    if (!partnerId) return
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    deleteMutation.mutate(partnerId, {
      onSuccess: () => {
        onClose()
        setConfirmDelete(false)
      },
    })
  }

  const handleDeleteProduct = (productId: string) => {
    if (!partnerId) return
    if (deletingProductId !== productId) {
      setDeletingProductId(productId)
      return
    }
    deleteProductMutation.mutate(
      { partnerId, productId },
      {
        onSuccess: () => setDeletingProductId(null),
      },
    )
  }

  return (
    <Modal
      isOpen={!!partnerId}
      onClose={() => {
        onClose()
        setConfirmDelete(false)
        setDeletingProductId(null)
      }}
      title="파트너 상세"
      footer={
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
          {confirmDelete ? (
            <>
              <p className="text-caption-md self-center text-danger">
                파트너 삭제 시 등록된 모든 상품이 함께 삭제됩니다.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setConfirmDelete(false)}
                >
                  취소
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  loading={deleteMutation.isPending}
                  onClick={handleDeletePartner}
                >
                  확인 삭제
                </Button>
              </div>
            </>
          ) : (
            <Button variant="danger" onClick={handleDeletePartner}>
              파트너 삭제
            </Button>
          )}
        </div>
      }
    >
      {isLoading || !data ? (
        <div className="py-10 text-center">
          <p className="text-body-md text-text-muted">로딩 중...</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* 파트너 정보 */}
          <div className="space-y-2">
            <InfoRow label="이름" value={data.partner.name} />
            <InfoRow label="연락처" value={data.partner.phone} />
            <InfoRow label="이메일" value={data.partner.user.email} />
            <InfoRow label="은행" value={data.partner.bankName} />
            <InfoRow label="계좌" value={data.partner.bankAccount} />
            <div className="flex items-center gap-3">
              <span className="text-body-md w-16 shrink-0 text-text-muted">상태</span>
              <Badge variant="green">승인됨</Badge>
            </div>
            <InfoRow label="신청일" value={formatDate(data.partner.createdAt)} />
          </div>

          {/* 등록한 파티 */}
          <div>
            <h3 className="text-body-md mb-2 font-semibold text-text-primary">
              등록한 파티 ({data.products.length})
            </h3>
            {data.products.length === 0 ? (
              <p className="text-caption-md text-text-muted">등록한 파티가 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {data.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-body-md truncate font-medium text-text-primary">
                          {product.name}
                        </span>
                        <Badge
                          variant={
                            product.status === 'recruiting'
                              ? 'green'
                              : product.status === 'closed'
                                ? 'red'
                                : 'gray'
                          }
                        >
                          {product.status === 'recruiting'
                            ? '모집중'
                            : product.status === 'closed'
                              ? '닫힘'
                              : '만료'}
                        </Badge>
                      </div>
                      <p className="text-caption-md text-text-secondary">
                        {formatPrice(product.price)}원 · {product.durationDays}일 ·{' '}
                        {product.filledSlots}/{product.totalSlots}명
                      </p>
                    </div>
                    <Button
                      variant={deletingProductId === product.id ? 'danger' : 'secondary'}
                      size="xs"
                      loading={
                        deleteProductMutation.isPending &&
                        deletingProductId === product.id
                      }
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      {deletingProductId === product.id ? '확인' : '삭제'}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-body-md w-16 shrink-0 text-text-muted">{label}</span>
      <span className="text-body-md text-text-primary">{value}</span>
    </div>
  )
}
