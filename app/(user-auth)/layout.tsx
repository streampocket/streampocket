import Link from 'next/link'
import { USER_BRAND_NAME } from '@/constants/app'

type UserAuthLayoutProps = {
  children: React.ReactNode
}

export default function UserAuthLayout({ children }: UserAuthLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex flex-col items-center gap-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-lg font-bold text-white">
            OT
          </span>
          <span className="text-xl font-bold text-text-primary">{USER_BRAND_NAME}</span>
        </Link>
        {children}
      </div>
    </main>
  )
}
