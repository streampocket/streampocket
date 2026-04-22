'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { userApi } from '@/lib/userApi'
import { Button } from '@/components/ui/Button'

type Phase = 'verifying' | 'paid' | 'failed'

type VerifyResponse = {
  data: {
    paymentId: string
    status: 'paid'
    applicationId: string
  }
}

export function PaymentResultClient() {
  const router = useRouter()
  const params = useSearchParams()
  const [phase, setPhase] = useState<Phase>('verifying')
  const [message, setMessage] = useState<string>('결제 결과를 확인하는 중입니다...')
  const calledRef = useRef(false)

  useEffect(() => {
    if (calledRef.current) return
    calledRef.current = true

    const paymentId = params.get('paymentId')
    const code = params.get('code')
    const errorMessage = params.get('message')

    if (code) {
      setPhase('failed')
      setMessage(errorMessage ?? '결제에 실패했습니다.')
      if (paymentId) {
        userApi.post(`/own/payments/${paymentId}/abort`).catch(() => {})
      }
      return
    }

    if (!paymentId) {
      setPhase('failed')
      setMessage('결제 정보가 확인되지 않았습니다.')
      return
    }

    userApi
      .post<VerifyResponse>(`/own/payments/${paymentId}/verify`)
      .then(() => {
        setPhase('paid')
        setMessage('결제가 완료되었습니다.')
      })
      .catch((err: Error) => {
        setPhase('failed')
        setMessage(err.message ?? '결제 검증에 실패했습니다.')
      })
  }, [params])

  return (
    <div className="w-full space-y-4 rounded-xl border border-border bg-white p-6 text-center">
      <h1 className="text-heading-md text-text-primary">
        {phase === 'verifying' && '결제 확인 중'}
        {phase === 'paid' && '결제 완료'}
        {phase === 'failed' && '결제 실패'}
      </h1>
      <p className="text-body-md text-text-secondary">{message}</p>
      {phase !== 'verifying' && (
        <div className="flex justify-center gap-2 pt-2">
          <Button variant="secondary" onClick={() => router.push('/party')}>
            파티 목록
          </Button>
          {phase === 'paid' && (
            <Button variant="primary" onClick={() => router.push('/mypage')}>
              마이페이지
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
