import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/providers/AuthProvider'
import { QueryProvider } from '@/providers/QueryProvider'
import { UIProvider } from '@/providers/UIProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { template: '%s | 스트림포켓', default: '스트림포켓' },
  description: '스트림포켓 관리자 시스템',
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>
          <QueryProvider>
            <UIProvider>{children}</UIProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
