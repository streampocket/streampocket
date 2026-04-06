'use client'

type UserInfo = {
  id: string
  email: string
  name: string
}

type UserAuthSessionInput = {
  token: string
  user: UserInfo
}

type StoredUserAuthSession = UserAuthSessionInput

const USER_AUTH_STORAGE_KEY = 'streampocket.user.auth'

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

function parseStoredSession(value: string | null): StoredUserAuthSession | null {
  if (!value) return null

  try {
    const parsed: unknown = JSON.parse(value)

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'token' in parsed &&
      'user' in parsed &&
      typeof parsed.token === 'string' &&
      typeof parsed.user === 'object' &&
      parsed.user !== null &&
      'id' in parsed.user &&
      'email' in parsed.user &&
      'name' in parsed.user &&
      typeof parsed.user.id === 'string' &&
      typeof parsed.user.email === 'string' &&
      typeof parsed.user.name === 'string'
    ) {
      return {
        token: parsed.token,
        user: {
          id: parsed.user.id,
          email: parsed.user.email,
          name: parsed.user.name,
        },
      }
    }

    return null
  } catch {
    return null
  }
}

export function getUserAuthSession(): StoredUserAuthSession | null {
  if (!isBrowser()) return null
  return parseStoredSession(window.localStorage.getItem(USER_AUTH_STORAGE_KEY))
}

export function getUserAccessToken(): string | null {
  return getUserAuthSession()?.token ?? null
}

export function getUserInfo(): UserInfo | null {
  return getUserAuthSession()?.user ?? null
}

export function setUserAuthSession(input: UserAuthSessionInput): void {
  if (!isBrowser()) return
  window.localStorage.setItem(USER_AUTH_STORAGE_KEY, JSON.stringify(input))
}

export function clearUserAuthSession(): void {
  if (!isBrowser()) return
  window.localStorage.removeItem(USER_AUTH_STORAGE_KEY)
}

export function isUserAuthenticated(): boolean {
  return getUserAccessToken() !== null
}
