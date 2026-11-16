'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { MESSAGE_TEMPLATE_CONTENT_MAX, MESSAGE_TEMPLATE_NAME_MAX } from '../_constants'
import { useCreateMessageTemplate, useUpdateMessageTemplate } from '../_hooks/useMessageTemplates'
import type { MessageTemplate } from '../_types'

type MessageTemplateFormModalProps = {
  isOpen: boolean
  /** null이면 새 양식, 있으면 그 양식 수정 */
  template: MessageTemplate | null
  onClose: () => void
}

const INPUT_CLASS =
  'text-body-md w-full rounded-lg border border-border bg-white px-3 py-2 text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none'

export function MessageTemplateFormModal({ isOpen, template, onClose }: MessageTemplateFormModalProps) {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const createMutation = useCreateMessageTemplate()
  const updateMutation = useUpdateMessageTemplate()
  const isPending = createMutation.isPending || updateMutation.isPending

  // 열 때마다 대상 양식 값으로 초기화 (닫았다 다시 열면 이전 입력이 남지 않게)
  useEffect(() => {
    if (!isOpen) return
    setName(template?.name ?? '')
    setContent(template?.content ?? '')
  }, [isOpen, template])

  const canSubmit = name.trim() !== '' && content.trim() !== ''

  const handleClose = () => {
    if (isPending) return
    onClose()
  }

  // 본문은 trim하지 않는다 — 붙여넣은 문구의 줄바꿈·들여쓰기를 그대로 복사해야 하므로
  const handleSubmit = () => {
    if (!canSubmit) return
    const input = { name: name.trim(), content }
    if (template) {
      updateMutation.mutate({ id: template.id, input }, { onSuccess: onClose })
      return
    }
    createMutation.mutate(input, { onSuccess: onClose })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={template ? '양식 수정' : '새 양식'}
      className="max-w-2xl"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={isPending}>
            취소
          </Button>
          {/* Button은 disabled가 주어지면 loading으로 막지 않으므로 isPending도 함께 — 저장 중 중복 클릭 방지 */}
          <Button loading={isPending} disabled={!canSubmit || isPending} onClick={handleSubmit}>
            저장
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="message-template-name"
            className="text-caption-md mb-1.5 block font-semibold text-text-secondary"
          >
            양식 이름
          </label>
          <input
            id="message-template-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={MESSAGE_TEMPLATE_NAME_MAX}
            placeholder="예: 넷플릭스 계정 안내"
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label
            htmlFor="message-template-content"
            className="text-caption-md mb-1.5 flex justify-between font-semibold text-text-secondary"
          >
            <span>내용</span>
            <span className="font-normal text-text-muted">
              {content.length.toLocaleString()} / {MESSAGE_TEMPLATE_CONTENT_MAX.toLocaleString()}
            </span>
          </label>
          <textarea
            id="message-template-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            maxLength={MESSAGE_TEMPLATE_CONTENT_MAX}
            placeholder="고객에게 보낼 문구를 입력하세요. 줄바꿈은 복사할 때 그대로 유지됩니다."
            className={INPUT_CLASS}
          />
        </div>
      </div>
    </Modal>
  )
}
