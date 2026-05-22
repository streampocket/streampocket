'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useCreateManualOrder } from '../_hooks/useCreateManualOrder'

const INPUT_CLASS =
  'w-full rounded-lg border border-border px-3 py-2 text-body-md text-text-primary outline-none focus:border-brand'

type ManualOrderCreateModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function ManualOrderCreateModal({ isOpen, onClose }: ManualOrderCreateModalProps) {
  const createManualOrder = useCreateManualOrder()

  const [productName, setProductName] = useState('')
  const [receiverName, setReceiverName] = useState('')
  const [netProfit, setNetProfit] = useState('')

  const reset = () => {
    setProductName('')
    setReceiverName('')
    setNetProfit('')
  }

  const handleClose = () => {
    if (createManualOrder.isPending) return
    onClose()
  }

  const handleSubmit = () => {
    const trimmedProduct = productName.trim()
    const trimmedReceiver = receiverName.trim()
    const profit = Number(netProfit)

    if (!trimmedProduct) {
      toast.error('상품명을 입력해 주세요.')
      return
    }
    if (!trimmedReceiver) {
      toast.error('수신자명을 입력해 주세요.')
      return
    }
    if (!Number.isFinite(profit) || profit < 0) {
      toast.error('순수익은 0 이상의 숫자여야 합니다.')
      return
    }

    createManualOrder.mutate(
      {
        productName: trimmedProduct,
        receiverName: trimmedReceiver,
        netProfit: Math.trunc(profit),
      },
      {
        onSuccess: () => {
          reset()
          onClose()
        },
      },
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="수동 주문 생성"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={createManualOrder.isPending}>
            취소
          </Button>
          <Button onClick={handleSubmit} loading={createManualOrder.isPending}>
            생성
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-caption-md text-text-muted">
          상품주문번호는 <span className="font-mono">MAN_</span> 형식으로 자동 생성되며, 상태는
          <strong className="text-text-secondary"> 대기</strong>, 결제일시는 현재 시각으로 등록됩니다.
        </p>

        <div>
          <label className="text-label-md mb-1 block text-text-secondary">상품명</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="예: 발로란트 100VP"
            className={INPUT_CLASS}
            maxLength={255}
          />
        </div>

        <div>
          <label className="text-label-md mb-1 block text-text-secondary">수신자명</label>
          <input
            type="text"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            placeholder="예: 홍길동"
            className={INPUT_CLASS}
            maxLength={100}
          />
        </div>

        <div>
          <label className="text-label-md mb-1 block text-text-secondary">순수익 (원)</label>
          <input
            type="number"
            value={netProfit}
            onChange={(e) => setNetProfit(e.target.value)}
            placeholder="예: 5000"
            className={INPUT_CLASS}
            min={0}
          />
        </div>
      </div>
    </Modal>
  )
}
