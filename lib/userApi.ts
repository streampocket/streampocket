'use client'

import { API_BASE_URL, USER_LOGIN_PATH } from '@/constants/app'
import { clearUserAuthSession, getUserAccessToken } from '@/lib/userAuth'

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
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

  if (res.status === 401) {
    clearUserAuthSession()

    if (typeof window !== 'undefined' && window.location.pathname !== USER_LOGIN_PATH) {
      const next = `${window.location.pathname}${window.location.search}`
      window.location.replace(`${USER_LOGIN_PATH}?next=${encodeURIComponent(next)}`)
    }
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
