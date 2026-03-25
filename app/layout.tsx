import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/providers/AuthProvider'
import { QueryProvider } from '@/providers/QueryProvider'
import { UIProvider } from '@/providers/UIProvider'

export const metadata: Metadata = {
  title: { template: '%s | 스트림포켓', default: '스트림포켓' },
  description: '스트림포켓 관리자 시스템',
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
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
        </AuthProvider>
      </body>
    </html>
  )
}
