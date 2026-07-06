'use client'

import { useRuleTemplates } from '../_hooks/useRuleTemplates'

type RuleTemplateSelectProps = {
  currentValue: string
  onApply: (content: string) => void
}

// 파티 규칙/메모 textarea 위에 놓이는 템플릿 선택 드롭다운.
// 규칙 칸이 비어 있으면 즉시 적용, 내용이 있으면 confirm 후 덮어쓴다.
export function RuleTemplateSelect({ currentValue, onApply }: RuleTemplateSelectProps) {
  const { data } = useRuleTemplates()
  const templates = data?.data ?? []

  if (templates.length === 0) return null

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = templates.find((template) => template.id === e.target.value)
    if (!selected) return
    if (currentValue.trim() !== '' && !window.confirm('기존 내용을 덮어쓸까요?')) return
    onApply(selected.content)
  }

  return (
    <select
      value=""
      onChange={handleChange}
      className="text-body-md mb-1 w-full rounded-lg border border-border bg-card-bg px-3 py-2 text-text-primary focus:border-brand focus:outline-none"
    >
      <option value="" disabled>
        규칙 템플릿 선택...
      </option>
      {templates.map((template) => (
        <option key={template.id} value={template.id}>
          {template.name}
        </option>
      ))}
    </select>
  )
}
