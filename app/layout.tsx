import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import { FloatingKakaoButton } from '@/components/layout/FloatingKakaoButton'
import { ReviewNudgeModal } from '@/components/reviews/ReviewNudgeModal'
import { VisitTracker } from '@/components/analytics/VisitTracker'
import { QueryProvider } from '@/providers/QueryProvider'
import { UIProvider } from '@/providers/UIProvider'
import { USER_SITE_URL } from '@/constants/app'

export const metadata: Metadata = {
  title: { template: '%s | OTTALL', default: 'OTTALL' },
  description: 'OTTALL(오티티올)에서 드라마박스, 드라마웨이브, 비글루, 릴숏, 넷숏, 숏맥스, 플릭릴스 등 OTT멤버십(구독권)을 파티(쉐어)로 나눠 저렴하게(싸게) 이용하세요.',
  metadataBase: new URL(USER_SITE_URL),
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? '',
    other: {
      'naver-site-verification': [process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION ?? ''],
    },
  },
}

// translate="no" + notranslate — 브라우저 자동 번역 차단.
// 번역기가 텍스트 노드를 자기 태그로 바꿔치기하면 React가 그 노드를 지우다 NotFoundError로 터진다
// (`/party`에서 실제 발생). 한국어 전용 서비스라 번역을 끄는 비용이 없고, 색인에는 영향이 없다.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" translate="no">
      <body className="notranslate">
        <QueryProvider>
          <UIProvider>
            <VisitTracker />
            {children}
            <FloatingKakaoButton />
            <ReviewNudgeModal />
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#1e293b',
                  color: '#f8fafc',
                  border: 'none',
                  fontFamily: 'var(--font-sans)',
                },
              }}
            />
          </UIProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
