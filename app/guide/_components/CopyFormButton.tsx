'use client'

import { useState } from 'react'

const DEFAULT_FORM_TEXT = `1. 스팀 등록 ID :

2. 스팀 등록 PW :

3. 스팀가드 해제 여부 :

4. 구매하신 게임 :

5. 구매 날짜 :

6. 구매자 성함 :

7. 국가 변경 및 등록 이후 환불 불가 동의 :`

type CopyFormButtonProps = {
  text?: string
}

export function CopyFormButton({ text }: CopyFormButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text ?? DEFAULT_FORM_TEXT)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-lg bg-gray-700 px-3 py-1.5 text-xs text-gray-200 transition-colors hover:bg-gray-600 active:bg-gray-500"
    >
      {copied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-green-400">복사됨</span>
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
          양식 복사
        </>
      )}
    </button>
  )
}
