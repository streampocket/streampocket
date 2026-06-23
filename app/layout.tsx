import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import { FloatingKakaoButton } from '@/components/layout/FloatingKakaoButton'
import { QueryProvider } from '@/providers/QueryProvider'
import { UIProvider } from '@/providers/UIProvider'

const SITE_URL = 'https://ottall.com'

export const metadata: Metadata = {
  title: { template: '%s | OTTALL', default: 'OTTALL' },
  description: 'OTTALL(오티티올)에서 드라마박스, 드라마웨이브, 비글루, 릴숏, 넷숏 등 OTT멤버십(구독권)을 파티(쉐어)로 나눠 저렴하게(싸게) 이용하세요.',
  metadataBase: new URL(SITE_URL),
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? '',
    other: {
      'naver-site-verification': [process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION ?? ''],
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <UIProvider>
            {children}
            <FloatingKakaoButton />
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
