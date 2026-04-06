'use client'

import { useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { cn } from '@/lib/utils'

type MarkdownEditorProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

type ToolbarAction = {
  label: string
  title: string
  action: (textarea: HTMLTextAreaElement, value: string) => { newValue: string; cursorPos: number }
}

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  {
    label: 'B',
    title: '굵게',
    action: (ta, val) => wrapSelection(ta, val, '**', '**'),
  },
  {
    label: 'I',
    title: '기울임',
    action: (ta, val) => wrapSelection(ta, val, '*', '*'),
  },
  {
    label: 'S',
    title: '취소선',
    action: (ta, val) => wrapSelection(ta, val, '~~', '~~'),
  },
  {
    label: 'H1',
    title: '제목 1',
    action: (ta, val) => prependLine(ta, val, '# '),
  },
  {
    label: 'H2',
    title: '제목 2',
    action: (ta, val) => prependLine(ta, val, '## '),
  },
  {
    label: 'H3',
    title: '제목 3',
    action: (ta, val) => prependLine(ta, val, '### '),
  },
  {
    label: '•',
    title: '글머리 기호',
    action: (ta, val) => prependLine(ta, val, '- '),
  },
  {
    label: '1.',
    title: '번호 매기기',
    action: (ta, val) => prependLine(ta, val, '1. '),
  },
  {
    label: '—',
    title: '구분선',
    action: (ta, val) => insertText(ta, val, '\n---\n'),
  },
]

function wrapSelection(
  ta: HTMLTextAreaElement,
  val: string,
  prefix: string,
  suffix: string,
): { newValue: string; cursorPos: number } {
  const start = ta.selectionStart
  const end = ta.selectionEnd
  const selected = val.slice(start, end)

  if (selected) {
    const newValue = val.slice(0, start) + prefix + selected + suffix + val.slice(end)
    return { newValue, cursorPos: end + prefix.length + suffix.length }
  }

  const placeholder = '텍스트'
  const newValue = val.slice(0, start) + prefix + placeholder + suffix + val.slice(end)
  return { newValue, cursorPos: start + prefix.length + placeholder.length }
}

function prependLine(
  ta: HTMLTextAreaElement,
  val: string,
  prefix: string,
): { newValue: string; cursorPos: number } {
  const start = ta.selectionStart
  const lineStart = val.lastIndexOf('\n', start - 1) + 1
  const newValue = val.slice(0, lineStart) + prefix + val.slice(lineStart)
  return { newValue, cursorPos: start + prefix.length }
}

function insertText(
  ta: HTMLTextAreaElement,
  val: string,
  text: string,
): { newValue: string; cursorPos: number } {
  const start = ta.selectionStart
  const newValue = val.slice(0, start) + text + val.slice(ta.selectionEnd)
  return { newValue, cursorPos: start + text.length }
}

export function MarkdownEditor({ value, onChange, placeholder, rows = 4 }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleToolbarClick = (toolAction: ToolbarAction) => {
    const ta = textareaRef.current
    if (!ta) return

    const { newValue, cursorPos } = toolAction.action(ta, value)
    onChange(newValue)

    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(cursorPos, cursorPos)
    })
  }

  return (
    <div className="space-y-2">
      {/* 에디터 영역 */}
      <div className="overflow-hidden rounded-lg border border-gray-300 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
        {/* 툴바 */}
        <div className="flex flex-wrap gap-0.5 border-b border-gray-200 bg-gray-50 px-1.5 py-1">
          {TOOLBAR_ACTIONS.map((tool) => (
            <button
              key={tool.title}
              type="button"
              title={tool.title}
              onClick={() => handleToolbarClick(tool)}
              className={cn(
                'rounded px-2 py-1 text-caption-md font-medium text-text-secondary transition',
                'hover:bg-gray-200 hover:text-text-primary',
                'active:bg-gray-300',
                tool.label === 'B' && 'font-bold',
                tool.label === 'I' && 'italic',
                tool.label === 'S' && 'line-through',
              )}
            >
              {tool.label}
            </button>
          ))}
        </div>

        {/* 입력 */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="text-body-md w-full resize-y border-none px-3 py-2 outline-none"
        />
      </div>

      {/* 미리보기 (항상 표시) */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
        <p className="text-caption-sm mb-1.5 font-medium text-text-muted">미리보기</p>
        <div
          className={cn(
            'text-body-md text-text-secondary',
            'prose prose-sm max-w-none',
            'prose-headings:text-text-primary prose-strong:text-text-primary',
            'prose-ul:my-1 prose-ol:my-1 prose-li:my-0',
          )}
        >
          {value.trim() ? (
            <ReactMarkdown>{value}</ReactMarkdown>
          ) : (
            <p className="text-text-muted">작성한 내용이 여기에 표시됩니다.</p>
          )}
        </div>
      </div>
    </div>
  )
}
