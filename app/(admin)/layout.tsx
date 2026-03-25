import { AuthGuard } from '@/components/auth/AuthGuard'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { MobileTabBar } from '@/components/layout/MobileTabBar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        {/* 사이드바 — 데스크탑 전용 */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* 메인 영역 */}
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6 pb-20 md:pb-6">{children}</main>
        </div>

        {/* 모바일 하단 탭바 */}
        <MobileTabBar />
      </div>
    </AuthGuard>
  )
}
