'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setIsLoading(false)

    if (result?.error) {
      toast.error('이메일 또는 비밀번호가 올바르지 않습니다.')
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card-bg p-6 shadow-[0_1px_3px_rgba(0,0,0,.08),0_1px_2px_rgba(0,0,0,.06)]"
    >
      <div className="mb-4">
        <label className="text-caption-md mb-1.5 block font-semibold text-text-secondary">
          이메일
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          required
          className={cn(
            'w-full rounded-lg border border-border bg-white px-3 py-2',
            'text-body-md text-text-primary placeholder:text-text-muted',
            'outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-light',
          )}
        />
      </div>

      <div className="mb-6">
        <label className="text-caption-md mb-1.5 block font-semibold text-text-secondary">
          비밀번호
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className={cn(
            'w-full rounded-lg border border-border bg-white px-3 py-2',
            'text-body-md text-text-primary placeholder:text-text-muted',
            'outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-light',
          )}
        />
      </div>

      <Button type="submit" loading={isLoading} className="w-full">
        로그인
      </Button>
    </form>
  )
}
