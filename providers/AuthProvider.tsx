'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'

type AuthProviderProps = {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}
