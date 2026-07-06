'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useRuleTemplates } from '../_hooks/useRuleTemplates'
import { useCreateRuleTemplate } from '../_hooks/useCreateRuleTemplate'
import { useUpdateRuleTemplate } from '../_hooks/useUpdateRuleTemplate'
import { useDeleteRuleTemplate } from '../_hooks/useDeleteRuleTemplate'
import type { RuleTemplate } from '../_types'

type RuleTemplateManageModalProps = {
  isOpen: boolean
  onClose: () => void
}

// 단일 모달 안에서 목록 뷰 ↔ 편집 뷰(생성/수정 겸용)를 전환한다 (중첩 모달 회피)
type ModalView = { mode: 'list' } | { mode: 'form'; editing: RuleTemplate | null }

export function RuleTemplateManageModal({ isOpen, onClose }: RuleTemplateManageModalProps) {
  const [view, setView] = useState<ModalView>({ mode: 'list' })
  const [name, setName] = useState('')
  const [content, setContent] = useState('')

  const { data, isLoading } = useRuleTemplates()
  const createMutation = useCreateRuleTemplate()
  const updateMutation = useUpdateRuleTemplate()
  const deleteMutation = useDeleteRuleTemplate()

  const templates = data?.data ?? []
  const isPending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending

  const openForm = (editing: RuleTemplate | null) => {
    setName(editing?.name ?? '')
    setContent(editing?.content ?? '')
    setView({ mode: 'form', editing })
  }

  const backToList = () => {
    setView({ mode: 'list' })
    setName('')
    setContent('')
  }

  const handleClose = () => {
    if (isPending) return
    backToList()
    onClose()
  }

  const handleDelete = (template: RuleTemplate) => {
    if (!window.confirm(`'${template.name}' 템플릿을 삭제할까요?`)) return
    deleteMutation.mutate(template.id, {
      onSuccess: () => toast.success('템플릿이 삭제되었습니다.'),
      onError: (error) => toast.error(error.message),
    })
  }

  const handleSubmit = () => {
    const trimmedName = name.trim()
    const trimmedContent = content.trim()
    if (!trimmedName || !trimmedContent) {
      toast.error('이름과 규칙 내용을 모두 입력해주세요.')
      return
    }

    if (view.mode === 'form' && view.editing) {
      updateMutation.mutate(
        { id: view.editing.id, input: { name: trimmedName, content: trimmedContent } },
        {
          onSuccess: () => {
            toast.success('템플릿이 수정되었습니다.')
            backToList()
          },
          onError: (error) => toast.error(error.message),
        },
      )
      return
    }

    createMutation.mutate(
      { name: trimmedName, content: trimmedContent },
      {
        onSuccess: () => {
          toast.success('템플릿이 등록되었습니다.')
          backToList()
        },
        onError: (error) => toast.error(error.message),
      },
    )
  }

  const footer =
    view.mode === 'list' ? (
      <Button variant="secondary" size="sm" onClick={handleClose}>
        닫기
      </Button>
    ) : (
      <>
        <Button variant="secondary" size="sm" onClick={backToList} disabled={isPending}>
          취소
        </Button>
        <Button variant="primary" size="sm" onClick={handleSubmit} disabled={isPending}>
          {isPending ? '저장 중...' : '저장'}
        </Button>
      </>
    )

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="규칙 템플릿 관리" footer={footer}>
      {view.mode === 'list' ? (
        <div className="space-y-3">
          <Button variant="primary" size="sm" onClick={() => openForm(null)}>
            + 새 템플릿
          </Button>

          {isLoading ? (
            <p className="text-body-md py-8 text-center text-text-muted">로딩 중...</p>
          ) : templates.length === 0 ? (
            <p className="text-body-md py-8 text-center text-text-muted">
              등록된 템플릿이 없습니다. 자주 쓰는 파티 규칙을 템플릿으로 등록해보세요.
            </p>
          ) : (
            <ul className="max-h-[50vh] space-y-2 overflow-y-auto">
              {templates.map((template) => (
                <li
                  key={template.id}
                  className="rounded-lg border border-border bg-card-bg p-3"
                >
                  <p className="text-body-md font-medium text-text-primary">{template.name}</p>
                  <p className="text-caption-md mt-0.5 truncate text-text-muted">
                    {template.content.split('\n')[0]}
                  </p>
                  <div className="mt-2 flex justify-end gap-2">
                    <Button variant="secondary" size="sm" onClick={() => openForm(template)}>
                      수정
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(template)}
                      disabled={deleteMutation.isPending}
                    >
                      삭제
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <button
            type="button"
            onClick={backToList}
            className="text-caption-md text-text-muted transition-colors hover:text-text-primary"
          >
            ← 목록으로
          </button>

          <label className="block space-y-1">
            <span className="text-caption-md font-medium text-text-secondary">템플릿 이름</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              placeholder="예: 넷플릭스 기본"
              className={INPUT_CLASS}
            />
          </label>

          <label className="block space-y-1">
            <span className="text-caption-md font-medium text-text-secondary">규칙 내용</span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              maxLength={5000}
              placeholder="파티 규칙 내용을 입력하세요."
              className={INPUT_CLASS}
            />
          </label>
        </div>
      )}
    </Modal>
  )
}

const INPUT_CLASS =
  'text-body-md w-full rounded-lg border border-border bg-card-bg px-3 py-2 text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none'
