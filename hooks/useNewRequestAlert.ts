'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import type { OtpResetRequest } from '@/hooks/useOtpResetRequests'

const TITLE_PREFIX = /^\(\d+\) /

// 탭 제목 앞에 "(N) "을 붙이거나 뗀다 — 같은 값이면 쓰지 않아 MutationObserver가 무한히 돌지 않는다
function applyTitlePrefix(count: number) {
  const base = document.title.replace(TITLE_PREFIX, '')
  const next = count > 0 ? `(${count}) ${base}` : base
  if (document.title !== next) document.title = next
}

// 짧은 "띵동" — 음원 파일 없이 Web Audio로 만든다. 브라우저 정책상 페이지를 한 번 클릭한 뒤부터 소리가 난다
let audioContext: AudioContext | null = null
function playChime() {
  try {
    audioContext ??= new AudioContext()
    const ctx = audioContext
    void ctx.resume()
    const tones = [880, 660]
    tones.forEach((frequency, index) => {
      const start = ctx.currentTime + index * 0.18
      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()
      oscillator.frequency.value = frequency
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(0.25, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16)
      oscillator.connect(gain).connect(ctx.destination)
      oscillator.start(start)
      oscillator.stop(start + 0.17)
    })
  } catch {
    // 소리는 보조 수단 — 실패해도 배지·토스트는 그대로
  }
}

function showDesktopNotification(newItems: OtpResetRequest[]) {
  if (typeof window === 'undefined' || !('Notification' in window)) return
  if (Notification.permission !== 'granted') return
  const first = newItems[0]
  const more = newItems.length > 1 ? ` 외 ${newItems.length - 1}건` : ''
  const notification = new Notification('OTP 재발급 요청', {
    body: `${first.productName} · ${first.userName ?? '(알 수 없음)'}${more}`,
    tag: 'otp-reset-request', // 연달아 와도 알림이 쌓이지 않고 교체된다
  })
  notification.onclick = () => {
    window.focus()
    notification.close()
  }
}

/**
 * 새 재발급 요청이 생기면 데스크톱 알림·알림음·토스트로 알리고, 탭 제목에 건수를 붙인다.
 * 처음 불러온 목록은 기준으로만 저장하고 울리지 않는다 (새로고침할 때마다 울리지 않게).
 */
export function useNewRequestAlert(requests: OtpResetRequest[] | undefined) {
  const knownIds = useRef<Set<string> | null>(null)
  const pathname = usePathname()
  const count = requests?.length ?? 0

  useEffect(() => {
    if (!requests) return
    const currentIds = new Set(requests.map((request) => request.applicationId))
    const previous = knownIds.current
    knownIds.current = currentIds
    if (previous === null) return

    const newItems = requests.filter((request) => !previous.has(request.applicationId))
    if (newItems.length === 0) return
    showDesktopNotification(newItems)
    playChime()
    toast.info(`OTP 재발급 요청 ${newItems.length}건이 들어왔습니다. 상단 🔔에서 처리하세요.`)
  }, [requests])

  // 페이지 이동 시 Next가 제목을 다시 쓰므로 <head> 변화를 지켜보며 다시 붙인다
  useEffect(() => {
    applyTitlePrefix(count)
    const observer = new MutationObserver(() => applyTitlePrefix(count))
    observer.observe(document.head, { childList: true, subtree: true, characterData: true })
    return () => {
      observer.disconnect()
      applyTitlePrefix(0)
    }
  }, [count, pathname])
}
