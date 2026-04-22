'use client'

import { useState } from 'react'
import * as PortOne from '@portone/browser-sdk/v2'
import {
  PORTONE_STORE_ID,
  PORTONE_KAKAOPAY_CHANNEL_KEY,
  PORTONE_GALAXIA_CHANNEL_KEY,
  type PayMethod,
} from '@/constants/app'

type RequestPaymentInput = {
  paymentId: string
  orderName: string
  amount: number
  payMethod: PayMethod
}

type PaymentResult =
  | { status: 'paid'; paymentId: string }
  | { status: 'cancelled'; message: string }
  | { status: 'failed'; message: string }

function resolveChannelKey(payMethod: PayMethod): string {
  return payMethod === 'kakaopay' ? PORTONE_KAKAOPAY_CHANNEL_KEY : PORTONE_GALAXIA_CHANNEL_KEY
}

function buildPayMethodPayload(payMethod: PayMethod) {
  switch (payMethod) {
    case 'kakaopay':
      return { payMethod: 'EASY_PAY' as const, easyPay: { easyPayProvider: 'KAKAOPAY' as const } }
    case 'card':
      return { payMethod: 'CARD' as const }
    case 'transfer':
      return { payMethod: 'TRANSFER' as const }
    case 'virtualAccount': {
      const expiry = new Date()
      expiry.setDate(expiry.getDate() + 1)
      return {
        payMethod: 'VIRTUAL_ACCOUNT' as const,
        virtualAccount: { accountExpiry: { dueDate: expiry.toISOString() } },
      }
    }
    case 'mobile':
      return { payMethod: 'MOBILE' as const }
  }
}

export function usePortOnePayment() {
  const [isPending, setIsPending] = useState(false)

  async function request(input: RequestPaymentInput): Promise<PaymentResult> {
    if (!PORTONE_STORE_ID) {
      return { status: 'failed', message: '포트원 Store ID가 설정되지 않았습니다.' }
    }
    const channelKey = resolveChannelKey(input.payMethod)
    if (!channelKey) {
      return { status: 'failed', message: '결제 채널이 설정되지 않았습니다.' }
    }

    setIsPending(true)
    try {
      const redirectUrl = `${window.location.origin}/party/payment/result`
      // 갤럭시아 채널은 customerId 20자 제한. SDK 기본 자동생성값이 초과되므로 명시 지정
      const customerId = input.paymentId.replace(/-/g, '').slice(0, 20)
      const request = {
        storeId: PORTONE_STORE_ID,
        channelKey,
        paymentId: input.paymentId,
        orderName: input.orderName,
        totalAmount: input.amount,
        currency: 'CURRENCY_KRW' as const,
        redirectUrl,
        customer: { customerId },
        ...buildPayMethodPayload(input.payMethod),
      }
      // 단언 사유: PortOne SDK의 PaymentRequest는 모든 결제수단 필드를 포함한 합집합 타입이라 수단별 payload 병합만으로는 좁혀지지 않음
      const response = await PortOne.requestPayment(request as Parameters<typeof PortOne.requestPayment>[0])

      if (!response) {
        return { status: 'cancelled', message: '결제가 취소되었습니다.' }
      }
      if (response.code !== undefined) {
        return { status: 'failed', message: response.message ?? '결제에 실패했습니다.' }
      }
      return { status: 'paid', paymentId: response.paymentId }
    } catch (err) {
      const message = err instanceof Error ? err.message : '결제 요청 중 오류가 발생했습니다.'
      return { status: 'failed', message }
    } finally {
      setIsPending(false)
    }
  }

  return { request, isPending }
}
