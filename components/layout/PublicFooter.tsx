import Link from 'next/link'
import { BRAND_NAME, KAKAO_OPEN_CHAT_URL, LOGIN_PATH } from '@/constants/app'

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-5 py-5 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <p className="font-bold text-text-primary">
          {BRAND_NAME} · <Link href={LOGIN_PATH}>로그인 후 파티 참여</Link>
        </p>
        <Link
          href={KAKAO_OPEN_CHAT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          구매&질문 문의 →
        </Link>
      </div>
    </footer>
  )
}
