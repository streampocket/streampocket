'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { ChatbotMenuItem } from '@/types/domain'
import { useChatbotMenu } from '../_hooks/useChatbotMenu'
import { ChatbotMenuItemModal } from './ChatbotMenuItemModal'

const inputClass =
  'w-full rounded-lg border border-border bg-card-bg px-3 py-2 text-body-md text-text-primary focus:border-brand focus:outline-none'

export function ChatbotMenuSettings() {
  const { query, updateWelcome, deleteItem, reorder } = useChatbotMenu()
  const [welcome, setWelcome] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ChatbotMenuItem | null>(null)

  useEffect(() => {
    if (query.data) setWelcome(query.data.welcomeMessage ?? '')
  }, [query.data])

  const items = query.data?.items ?? []
  const welcomeUnchanged = welcome === (query.data?.welcomeMessage ?? '')

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    reorder.mutate(next.map((i) => i.id))
  }

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }
  const openEdit = (item: ChatbotMenuItem) => {
    setEditing(item)
    setModalOpen(true)
  }
  const handleDelete = (item: ChatbotMenuItem) => {
    if (window.confirm(`'${item.label}' 메뉴를 삭제할까요?`)) {
      deleteItem.mutate(item.id)
    }
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-heading-md text-text-primary">카카오 챗봇 메뉴</h2>
        <Button variant="primary" size="sm" onClick={openCreate}>
          + 메뉴 추가
        </Button>
      </CardHeader>
      <CardBody>
        <p className="mb-3 text-caption-sm text-text-muted">
          카카오 챗봇이 채팅 시작 시 보여주는 인사말과 클릭형 메뉴를 관리합니다. 변경은 즉시
          반영됩니다.
        </p>

        {/* 웰컴 인사말 */}
        <div className="mb-5">
          <label className="mb-1 block text-caption-md font-semibold text-text-primary">
            웰컴 인사말
          </label>
          <textarea
            className={`${inputClass} min-h-20 resize-y`}
            value={welcome}
            onChange={(e) => setWelcome(e.target.value)}
            placeholder="채팅 시작 시 챗봇이 보낼 인사말"
            maxLength={1000}
          />
          <Button
            variant="primary"
            size="sm"
            className="mt-2"
            disabled={welcomeUnchanged}
            loading={updateWelcome.isPending}
            onClick={() => updateWelcome.mutate(welcome.trim() === '' ? null : welcome.trim())}
          >
            인사말 저장
          </Button>
        </div>

        {/* 메뉴 항목 목록 */}
        <label className="mb-1 block text-caption-md font-semibold text-text-primary">
          메뉴 항목 ({items.length})
        </label>
        {query.isLoading ? (
          <p className="text-caption-md text-text-muted">불러오는 중...</p>
        ) : items.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border py-6 text-center text-caption-md text-text-muted">
            등록된 메뉴가 없습니다. &lsquo;+ 메뉴 추가&rsquo;로 만들어주세요.
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li
                key={item.id}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2"
              >
                <div className="flex flex-col leading-none">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="text-caption-sm text-text-muted disabled:opacity-30"
                    aria-label="위로 이동"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                    className="text-caption-sm text-text-muted disabled:opacity-30"
                    aria-label="아래로 이동"
                  >
                    ▼
                  </button>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body-md text-text-primary">{item.label}</p>
                  <p className="truncate text-caption-sm text-text-muted">{item.body}</p>
                </div>
                {!item.isActive && (
                  <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-caption-sm text-text-muted">
                    숨김
                  </span>
                )}
                <Button variant="secondary" size="sm" onClick={() => openEdit(item)}>
                  수정
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(item)}>
                  삭제
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardBody>

      <ChatbotMenuItemModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        item={editing}
      />
    </Card>
  )
}
