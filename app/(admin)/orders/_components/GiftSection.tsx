'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn, formatDate } from '@/lib/utils'
import type { SteamOrderItem } from '@/types/domain'
import { useUpdateFriendLinks } from '../_hooks/useUpdateFriendLinks'
import { useSendOrderStatusAlimtalk } from '../_hooks/useSendOrderStatusAlimtalk'

const giftInputClass = cn(
  'w-full rounded-lg border border-border bg-white px-3 py-2',
  'text-body-md text-text-primary placeholder:text-text-muted',
  'outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-light',
)

const GIFT_RECEIPT_LINK_OPTIONS = [
  { value: 'https://new.zqbg.cn/steam2/zqbcdk/cdk', label: '기본' },
  { value: 'https://new.zqbg.cn/steam2/zqbcdk/customcdk', label: '커스텀' },
]

type GiftSectionProps = {
  order: SteamOrderItem
  /** 섹션 제목 (기본: 선물 처리 (AA)) */
  title?: string
  /** 주문상황 알림톡 발송 버튼 노출 여부 (기본: true) — 수동 주문은 전화번호가 없어 false */
  showOrderStatusAlimtalk?: boolean
}

// 네이버/수동 주문 상세 모달의 공통 "입력/저장" 섹션 (친구링크·선물코드·선물접수링크·게임URL·메모)
export function GiftSection({
  order,
  title = '선물 처리 (AA)',
  showOrderStatusAlimtalk = true,
}: GiftSectionProps) {
  const [link1, setLink1] = useState(order.friendLink1 ?? '')
  const [link2, setLink2] = useState(order.friendLink2 ?? '')
  const [friendCode, setFriendCode] = useState(order.friendCode ?? '')
  const [giftCode, setGiftCode] = useState(order.giftCode ?? '')
  const [gameUrl, setGameUrl] = useState(order.gameUrl ?? '')
  const [memo, setMemo] = useState(order.memo ?? '')
  const [zqbgEnabled, setZqbgEnabled] = useState(order.zqbgAutoCheckEnabled ?? false)
  const [receiptLink, setReceiptLink] = useState(
    order.gameUrl ? GIFT_RECEIPT_LINK_OPTIONS[1].value : GIFT_RECEIPT_LINK_OPTIONS[0].value,
  )
  const { mutate: updateLinks, isPending: isSaving } = useUpdateFriendLinks()
  const { mutate: sendOrderStatus, isPending: isSendingStatus } = useSendOrderStatusAlimtalk()

  useEffect(() => {
    setLink1(order.friendLink1 ?? '')
    setLink2(order.friendLink2 ?? '')
    setFriendCode(order.friendCode ?? '')
    setGiftCode(order.giftCode ?? '')
    setGameUrl(order.gameUrl ?? '')
    setMemo(order.memo ?? '')
    setZqbgEnabled(order.zqbgAutoCheckEnabled ?? false)
    setReceiptLink(
      order.gameUrl ? GIFT_RECEIPT_LINK_OPTIONS[1].value : GIFT_RECEIPT_LINK_OPTIONS[0].value,
    )
  }, [
    order.friendLink1,
    order.friendLink2,
    order.friendCode,
    order.giftCode,
    order.gameUrl,
    order.memo,
    order.zqbgAutoCheckEnabled,
  ])

  const normalized1 = link1.trim()
  const normalized2 = link2.trim()
  const normalizedFriendCode = friendCode.trim()
  const normalizedGiftCode = giftCode.trim()
  const normalizedGameUrl = gameUrl.trim()
  const normalizedMemo = memo.trim()
  const isDirty =
    normalized1 !== (order.friendLink1 ?? '') ||
    normalized2 !== (order.friendLink2 ?? '') ||
    normalizedFriendCode !== (order.friendCode ?? '') ||
    normalizedGiftCode !== (order.giftCode ?? '') ||
    normalizedGameUrl !== (order.gameUrl ?? '') ||
    normalizedMemo !== (order.memo ?? '') ||
    zqbgEnabled !== (order.zqbgAutoCheckEnabled ?? false)

  const handleCopy = async (value: string) => {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      toast.success('복사되었습니다.')
    } catch {
      toast.error('복사에 실패했습니다.')
    }
  }

  const handleSave = () => {
    updateLinks({
      id: order.id,
      friendLink1: normalized1 ? normalized1 : null,
      friendLink2: normalized2 ? normalized2 : null,
      friendCode: normalizedFriendCode ? normalizedFriendCode : null,
      giftCode: normalizedGiftCode ? normalizedGiftCode : null,
      gameUrl: normalizedGameUrl ? normalizedGameUrl : null,
      memo: normalizedMemo ? normalizedMemo : null,
      zqbgAutoCheckEnabled: zqbgEnabled,
    })
  }

  const handleSendOrderStatus = () => {
    if (!window.confirm('주문상황 알림톡을 발송하시겠습니까?')) return
    sendOrderStatus(order.id)
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-surface-secondary p-3">
      <p className="text-caption-md font-semibold text-text-primary">{title}</p>

      {/* 제목 아래 컨트롤 행 — zqbg 토글(좌) / 주문상황 알림톡(우, 네이버 모달만) */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label
          className="flex cursor-pointer items-center gap-2"
          title="켜면 선물 코드로 발송상태를 자동 조회해 완료 처리합니다 (기본 꺼짐)"
        >
          <span className="text-caption-md text-text-muted">zqbg 자동 조회</span>
          <input
            type="checkbox"
            className="peer sr-only"
            checked={zqbgEnabled}
            onChange={(e) => setZqbgEnabled(e.target.checked)}
          />
          {/* 토글 스위치 — 트랙 + 노브 (peer-checked로 색·위치 전환) */}
          <span
            className={cn(
              'relative h-5 w-9 rounded-full bg-gray-300 transition-colors peer-checked:bg-brand',
              'after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full',
              'after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-4',
            )}
          />
        </label>

        {showOrderStatusAlimtalk &&
          (order.orderStatusAlimtalkSentAt ? (
            <Badge variant="green">
              주문상황 알림톡 발송 ({formatDate(order.orderStatusAlimtalkSentAt)})
            </Badge>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              loading={isSendingStatus}
              disabled={!order.receiverPhoneNumber}
              title={
                order.receiverPhoneNumber
                  ? undefined
                  : '수신 전화번호가 없어 발송할 수 없습니다.'
              }
              onClick={handleSendOrderStatus}
            >
              주문상황 알림톡
            </Button>
          ))}
      </div>

      {[
        { idx: 1, value: link1, setValue: setLink1, saved: order.friendLink1 },
        { idx: 2, value: link2, setValue: setLink2, saved: order.friendLink2 },
      ].map(({ idx, value, setValue, saved }) => (
        <div key={idx}>
          <label className="text-caption-md mb-1 block text-text-muted">친구 추가 링크 {idx}</label>
          <div className="flex gap-2">
            <input
              className={giftInputClass}
              placeholder="https://..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <Button
              size="sm"
              variant="secondary"
              disabled={!saved}
              onClick={() => saved && handleCopy(saved)}
            >
              복사
            </Button>
            <Button size="sm" variant="secondary" disabled={!value} onClick={() => setValue('')}>
              ✕
            </Button>
          </div>
        </div>
      ))}

      <div>
        <label className="text-caption-md mb-1 block text-text-muted">친구 코드</label>
        <div className="flex gap-2">
          <input
            className={giftInputClass}
            placeholder="자동 생성 시 함께 저장됩니다 (수동 입력 가능)"
            value={friendCode}
            onChange={(e) => setFriendCode(e.target.value)}
          />
          <Button
            size="sm"
            variant="secondary"
            disabled={!order.friendCode}
            onClick={() => order.friendCode && handleCopy(order.friendCode)}
          >
            복사
          </Button>
          <Button
            size="sm"
            variant="secondary"
            disabled={!friendCode}
            onClick={() => setFriendCode('')}
          >
            ✕
          </Button>
        </div>
      </div>

      <div>
        <label className="text-caption-md mb-1 block text-text-muted">선물 코드 번호</label>
        <div className="flex gap-2">
          <input
            className={giftInputClass}
            placeholder="선물 코드 번호 입력"
            value={giftCode}
            onChange={(e) => setGiftCode(e.target.value)}
          />
          <Button
            size="sm"
            variant="secondary"
            disabled={!order.giftCode}
            onClick={() => order.giftCode && handleCopy(order.giftCode)}
          >
            복사
          </Button>
          <Button
            size="sm"
            variant="secondary"
            disabled={!giftCode}
            onClick={() => setGiftCode('')}
          >
            ✕
          </Button>
        </div>
      </div>

      <div>
        <label className="text-caption-md mb-1 block text-text-muted">선물 접수 링크</label>
        <div className="flex gap-2">
          <select
            className={giftInputClass}
            value={receiptLink}
            onChange={(e) => setReceiptLink(e.target.value)}
          >
            {GIFT_RECEIPT_LINK_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <Button size="sm" variant="secondary" onClick={() => window.open(receiptLink, '_blank')}>
            이동
          </Button>
        </div>
      </div>

      {receiptLink === GIFT_RECEIPT_LINK_OPTIONS[1].value && (
        <div>
          <label className="text-caption-md mb-1 block text-text-muted">게임 URL</label>
          <div className="flex gap-2">
            <input
              className={giftInputClass}
              placeholder="https://store.steampowered.com/..."
              value={gameUrl}
              onChange={(e) => setGameUrl(e.target.value)}
            />
            <Button
              size="sm"
              variant="secondary"
              disabled={!order.gameUrl}
              onClick={() => order.gameUrl && handleCopy(order.gameUrl)}
            >
              복사
            </Button>
            <Button size="sm" variant="secondary" disabled={!gameUrl} onClick={() => setGameUrl('')}>
              ✕
            </Button>
          </div>
        </div>
      )}

      <div>
        <label className="text-caption-md mb-1 block text-text-muted">메모</label>
        <textarea
          className={cn(giftInputClass, 'min-h-24 resize-y')}
          rows={4}
          maxLength={1000}
          placeholder="자유 메모 (최대 1000자)"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <Button
          size="sm"
          variant="primary"
          disabled={!isDirty}
          loading={isSaving}
          onClick={handleSave}
        >
          저장
        </Button>
      </div>
    </div>
  )
}
