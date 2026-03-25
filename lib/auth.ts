'use client'

type AuthAdmin = {
  id: string
  email: string
}

type AuthSessionInput = {
  token: string
  admin: AuthAdmin
}

type StoredAuthSession = AuthSessionInput

const AUTH_STORAGE_KEY = 'streampocket.auth'

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

function parseStoredAuthSession(value: string | null): StoredAuthSession | null {
  if (!value) return null

  try {
    const parsed: unknown = JSON.parse(value)

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'token' in parsed &&
      'admin' in parsed &&
      typeof parsed.token === 'string' &&
      typeof parsed.admin === 'object' &&
      parsed.admin !== null &&
      'id' in parsed.admin &&
      'email' in parsed.admin &&
      typeof parsed.admin.id === 'string' &&
      typeof parsed.admin.email === 'string'
    ) {
      return {
        token: parsed.token,
        admin: {
          id: parsed.admin.id,
          email: parsed.admin.email,
        },
      }
    }

    return null
  } catch {
    return null
  }
}

export function getAuthSession(): StoredAuthSession | null {
  if (!isBrowser()) return null
  return parseStoredAuthSession(window.localStorage.getItem(AUTH_STORAGE_KEY))
}

export function getAccessToken(): string | null {
  return getAuthSession()?.token ?? null
}

export function getAuthAdmin(): AuthAdmin | null {
  return getAuthSession()?.admin ?? null
}

export function setAuthSession(input: AuthSessionInput): void {
  if (!isBrowser()) return
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(input))
}

export function clearAuthSession(): void {
  if (!isBrowser()) return
  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function isAuthenticated(): boolean {
  return getAccessToken() !== null
}
