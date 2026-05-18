'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import type { ChatbotMenuButton, ChatbotMenuItem } from '@/types/domain'
import { useChatbotMenu, uploadChatbotMenuImage } from '../_hooks/useChatbotMenu'

type Props = {
  isOpen: boolean
  onClose: () => void
  item: ChatbotMenuItem | null
}

const inputClass =
  'w-full rounded-lg border border-border bg-card-bg px-3 py-2 text-body-md text-text-primary focus:border-brand focus:outline-none'

export function ChatbotMenuItemModal({ isOpen, onClose, item }: Props) {
  const { createItem, updateItem } = useChatbotMenu()
  const [label, setLabel] = useState('')
  const [body, setBody] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [buttons, setButtons] = useState<ChatbotMenuButton[]>([])
  const [isActive, setIsActive] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setLabel(item?.label ?? '')
    setBody(item?.body ?? '')
    setImageUrl(item?.imageUrl ?? null)
    setButtons(item?.buttons ?? [])
    setIsActive(item?.isActive ?? true)
  }, [isOpen, item])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploading(true)
    try {
      setImageUrl(await uploadChatbotMenuImage(file))
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '이미지 업로드에 실패했습니다.')
    } finally {
      setUploading(false)
    }
  }

  const updateButton = (index: number, key: 'label' | 'url', value: string) => {
    setButtons((prev) => prev.map((b, i) => (i === index ? { ...b, [key]: value } : b)))
  }
  const addButton = () => {
    setButtons((prev) => (prev.length >= 3 ? prev : [...prev, { label: '', url: '' }]))
  }
  const removeButton = (index: number) => {
    setButtons((prev) => prev.filter((_, i) => i !== index))
  }

  const isSaving = createItem.isPending || updateItem.isPending
  const canSave = label.trim().length > 0 && body.trim().length > 0 && !uploading && !isSaving

  const handleSave = () => {
    // 라벨·URL이 모두 채워진 버튼만 저장
    const cleanedButtons = buttons
      .map((b) => ({ label: b.label.trim(), url: b.url.trim() }))
      .filter((b) => b.label.length > 0 && b.url.length > 0)
    const payload = {
      label: label.trim(),
      body: body.trim(),
      imageUrl,
      buttons: cleanedButtons,
      isActive,
    }
    if (item) {
      updateItem.mutate({ id: item.id, ...payload }, { onSuccess: onClose })
    } else {
      createItem.mutate(payload, { onSuccess: onClose })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? '메뉴 항목 수정' : '메뉴 항목 추가'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={!canSave} loading={isSaving}>
            저장
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-caption-md font-semibold text-text-primary">
            메뉴 이름 (버튼 텍스트)
          </label>
          <input
            className={inputClass}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="예: ⏰ 운영 시간"
            maxLength={100}
          />
          <p className="mt-1 text-caption-sm text-text-muted">
            구매자가 이 텍스트의 버튼을 누르면 아래 응답이 전송됩니다.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-caption-md font-semibold text-text-primary">
            응답 본문
          </label>
          <textarea
            className={`${inputClass} min-h-32 resize-y`}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="버튼을 눌렀을 때 챗봇이 보낼 내용"
          />
        </div>

        <div>
          <label className="mb-1 block text-caption-md font-semibold text-text-primary">
            이미지 (선택)
          </label>
          {imageUrl ? (
            <div className="flex items-start gap-3">
              <Image
                src={imageUrl}
                alt="메뉴 이미지 미리보기"
                width={120}
                height={120}
                className="rounded-lg border border-border object-cover"
              />
              <Button variant="secondary" size="sm" onClick={() => setImageUrl(null)}>
                이미지 삭제
              </Button>
            </div>
          ) : (
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              disabled={uploading}
              className="text-caption-md text-text-muted"
            />
          )}
          {uploading && <p className="mt-1 text-caption-sm text-text-muted">업로드 중...</p>}
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="block text-caption-md font-semibold text-text-primary">
              외부 링크 버튼 (선택, 최대 3개)
            </label>
            <Button
              variant="secondary"
              size="xs"
              onClick={addButton}
              disabled={buttons.length >= 3}
            >
              + 버튼 추가
            </Button>
          </div>
          <div className="space-y-2">
            {buttons.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className={`${inputClass} flex-1`}
                  value={b.label}
                  onChange={(e) => updateButton(i, 'label', e.target.value)}
                  placeholder="버튼 이름"
                  maxLength={20}
                />
                <input
                  className={`${inputClass} flex-[2]`}
                  value={b.url}
                  onChange={(e) => updateButton(i, 'url', e.target.value)}
                  placeholder="https://..."
                />
                <button
                  type="button"
                  onClick={() => removeButton(i)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-gray-100"
                  aria-label="버튼 삭제"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-body-md text-text-primary">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          메뉴에 노출 (체크 해제 시 숨김)
        </label>
      </div>
    </Modal>
  )
}
