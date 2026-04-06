'use client'

import { API_BASE_URL, USER_LOGIN_PATH } from '@/constants/app'
import { clearUserAuthSession, getUserAccessToken, setUserAuthSession, getUserInfo } from '@/lib/userAuth'

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

// 동시 다발 401 방지: 리프레시 진행 중이면 동일 Promise 공유
let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/own/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })

    if (!res.ok) return null

    const json = (await res.json()) as { data: { token: string } }
    const newToken = json.data.token
    const userInfo = getUserInfo()

    if (userInfo) {
      setUserAuthSession({ token: newToken, user: userInfo })
    }

    return newToken
  } catch {
    return null
  }
}

function getOrCreateRefreshPromise(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

function redirectToLogin(): void {
  clearUserAuthSession()
  if (typeof window !== 'undefined' && window.location.pathname !== USER_LOGIN_PATH) {
    const next = `${window.location.pathname}${window.location.search}`
    window.location.replace(`${USER_LOGIN_PATH}?next=${encodeURIComponent(next)}`)
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options
  const accessToken = getUserAccessToken()

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: 'include',
  })

  // 401 → 리프레시 시도 → 재요청
  if (res.status === 401) {
    const newToken = await getOrCreateRefreshPromise()

    if (!newToken) {
      redirectToLogin()
      throw new Error('인증이 만료되었습니다.')
    }

    // 새 토큰으로 원래 요청 재시도
    const retryRes = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newToken}`,
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: 'include',
    })

    if (retryRes.status === 401) {
      redirectToLogin()
      throw new Error('인증이 만료되었습니다.')
    }

    if (!retryRes.ok) {
      const error = await retryRes.json().catch(() => ({ message: retryRes.statusText }))
      throw new Error(error.message ?? '요청 실패')
    }

    if (retryRes.status === 204) return undefined as T
    return retryRes.json() as Promise<T>
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message ?? '요청 실패')
  }

  if (res.status === 204) return undefined as T

  return res.json() as Promise<T>
}

export const userApi = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),

  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),

  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
}
