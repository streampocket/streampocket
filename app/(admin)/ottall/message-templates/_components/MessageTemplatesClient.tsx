'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import {
  useDeleteMessageTemplate,
  useMessageTemplates,
  useReorderMessageTemplates,
} from '../_hooks/useMessageTemplates'
import type { MessageTemplate } from '../_types'
import { MessageTemplateCard } from './MessageTemplateCard'
import { MessageTemplateFormModal } from './MessageTemplateFormModal'

export function MessageTemplatesClient() {
  const { data: templates, isLoading, isError } = useMessageTemplates()
  const reorderMutation = useReorderMessageTemplates()
  const deleteMutation = useDeleteMessageTemplate()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<MessageTemplate | null>(null)

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (template: MessageTemplate) => {
    setEditing(template)
    setFormOpen(true)
  }

  // 이웃과 자리를 바꾼 전체 순서를 보낸다 (서버는 전체 id 순서를 받아 저장)
  const move = (index: number, direction: -1 | 1) => {
    if (!templates) return
    const target = index + direction
    if (target < 0 || target >= templates.length) return
    const ids = templates.map((template) => template.id)
    ;[ids[index], ids[target]] = [ids[target], ids[index]]
    reorderMutation.mutate(ids)
  }

  const remove = (template: MessageTemplate) => {
    if (!window.confirm(`'${template.name}' 양식을 삭제할까요?\n되돌릴 수 없습니다.`)) return
    deleteMutation.mutate(template.id)
  }

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-heading-sm text-text-primary">안내 양식</h2>
          <p className="text-caption-md mt-0.5 text-text-muted">
            자주 보내는 고객 안내 문구를 저장해 두고 &lsquo;복사&rsquo;로 바로 가져다 쓰세요. ▲▼로
            순서를 바꿀 수 있습니다.
          </p>
        </div>
        <Button onClick={openCreate}>+ 새 양식</Button>
      </header>

      {isLoading && (
        <p className="text-body-md py-12 text-center text-text-muted">불러오는 중...</p>
      )}
      {isError && (
        <p className="text-body-md py-12 text-center text-danger">양식을 불러오지 못했습니다.</p>
      )}
      {templates && templates.length === 0 && (
        <p className="text-body-md py-12 text-center text-text-muted">
          아직 양식이 없습니다. &lsquo;+ 새 양식&rsquo;으로 자주 쓰는 안내 문구를 등록해 보세요.
        </p>
      )}

      {templates && templates.length > 0 && (
        <ul className="space-y-3">
          {templates.map((template, index) => (
            <li key={template.id}>
              <MessageTemplateCard
                template={template}
                isFirst={index === 0}
                isLast={index === templates.length - 1}
                reorderDisabled={reorderMutation.isPending}
                onMoveUp={() => move(index, -1)}
                onMoveDown={() => move(index, 1)}
                onEdit={() => openEdit(template)}
                onDelete={() => remove(template)}
              />
            </li>
          ))}
        </ul>
      )}

      <MessageTemplateFormModal
        isOpen={formOpen}
        template={editing}
        onClose={() => setFormOpen(false)}
      />
    </section>
  )
}
