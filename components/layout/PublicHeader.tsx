import Link from 'next/link'
import { USER_BRAND_NAME } from '@/constants/app'
import type { LandingNavItem } from '@/app/(landing)/_types'
import { HeaderAuthButton } from './HeaderAuthButton'

type PublicHeaderProps = {
  navItems?: LandingNavItem[]
}

export function PublicHeader({ navItems = [] }: PublicHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-[72px] w-full max-w-[1440px] items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-base font-bold text-text-primary sm:text-lg">{USER_BRAND_NAME}</span>
        </Link>

        {navItems.length > 0 && (
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <HeaderAuthButton />
        </div>
      </div>
    </header>
  )
}
