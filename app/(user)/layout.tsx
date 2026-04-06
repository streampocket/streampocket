import { UserAuthGuard } from '@/components/auth/UserAuthGuard'
import { PublicHeader } from '@/components/layout/PublicHeader'

type UserLayoutProps = {
  children: React.ReactNode
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <UserAuthGuard>
      <div className="min-h-screen bg-gray-50">
        <PublicHeader />

        <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-8">
          {children}
        </main>
      </div>
    </UserAuthGuard>
  )
}
