import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import { QueryProvider } from '@/providers/QueryProvider'
import { UIProvider } from '@/providers/UIProvider'

const SITE_URL = 'https://ottall.com'

export const metadata: Metadata = {
  title: { template: '%s | OTTALL', default: 'OTTALL' },
  description: 'OTTALL(오티티올) - 쇼츠 드라마 OTT 공유 플랫폼',
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
