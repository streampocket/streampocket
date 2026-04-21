'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { getAccessToken } from '@/lib/auth'

type GoofishScriptInstallGuideProps = {
  onClose: () => void
}

export function GoofishScriptInstallGuide({ onClose }: GoofishScriptInstallGuideProps) {
  const [copied, setCopied] = useState(false)
  const token = getAccessToken()

  const handleCopyToken = async () => {
    if (!token) return
    await navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Goofish 수집 스크립트 설치 가이드"
      footer={
        <Button variant="secondary" onClick={onClose}>
          닫기
        </Button>
      }
    >
      <ol className="space-y-4 text-body-md text-text-primary">
        <li>
          <p className="font-semibold">1. Tampermonkey 확장 설치</p>
          <p className="mt-1 text-caption-md text-text-secondary">
            크롬/엣지/브레이브/파이어폭스 어디든 가능. 웹스토어에서 &quot;Tampermonkey&quot;를
            검색해 설치합니다.
          </p>
        </li>
        <li>
          <p className="font-semibold">2. 유저스크립트 등록</p>
          <p className="mt-1 text-caption-md text-text-secondary">
            저장소의{' '}
            <code className="rounded bg-background-muted px-1">scripts/goofish-monitor.user.js</code>{' '}
            파일 내용을 복사해 Tampermonkey 새 스크립트에 붙여넣고 저장합니다.
          </p>
        </li>
        <li>
          <p className="font-semibold">3. 관리자 JWT 1회 입력</p>
          <p className="mt-1 text-caption-md text-text-secondary">
            아래 버튼으로 현재 로그인 세션의 토큰을 복사해, 스크립트 실행 시 나타나는 입력창에
            붙여넣으세요. (브라우저별 Tampermonkey 저장소에만 보관됩니다)
          </p>
          <Button
            size="sm"
            variant="secondary"
            className="mt-2"
            onClick={handleCopyToken}
            disabled={!token}
          >
            {copied ? '복사됨 ✓' : token ? 'JWT 토큰 복사' : '로그인 필요'}
          </Button>
        </li>
        <li>
          <p className="font-semibold">4. 시크릿 창에서 Goofish 접속</p>
          <p className="mt-1 text-caption-md text-text-secondary">
            브라우저 시크릿 창을 열고 <code className="rounded bg-background-muted px-1">www.goofish.com</code>{' '}
            에 접속합니다. <strong>로그인하지 마세요.</strong>
          </p>
        </li>
        <li>
          <p className="font-semibold">5. 수집 버튼 클릭</p>
          <p className="mt-1 text-caption-md text-text-secondary">
            우측 하단 &quot;📦 스트림포켓 가격 수집&quot; 버튼 클릭 → 2~5분 대기 → Discord로
            전일비 변동 알림이 도착합니다.
          </p>
        </li>
      </ol>
    </Modal>
  )
}
