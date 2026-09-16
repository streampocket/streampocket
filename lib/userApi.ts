'use client'

import { API_BASE_URL, USER_LOGIN_PATH } from '@/constants/app'
import { clearUserAuthSession, getUserAccessToken, setUserAuthSession, getUserInfo } from '@/lib/userAuth'

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  /**
   * 401(리프레시 실패 포함) 시 로그인 페이지로 보낼지. 기본 true.
   * 공개 페이지에서 배경으로 도는 조회(리뷰 유도 모달 등)는 false —
   * 만료 토큰이 남은 방문자를 공개 페이지에서 로그인으로 튕겨내면 안 된다.
   * false여도 세션 정리는 동일하게 수행한다 (죽은 토큰 방치 방지).
   */
  redirectOn401?: boolean
}

/**
 * 인증 전 공개 엔드포인트 프리픽스.
 *
 * be의 `/own/auth/*`는 전부 미들웨어 없는 공개 라우트다(app.ts). 이 경로의 401은
 * "세션 만료"가 아니라 자격증명 불일치이므로, 리프레시를 시도하거나 메시지를 덮으면
 * 실제 사유가 가려진다 — 로그인 실패가 "인증이 만료되었습니다"로 보이던 원인이다.
 *
 * ⚠️ 로그인이 필요한 엔드포인트를 이 프리픽스 아래에 두면 리프레시가 건너뛰어진다.
 *    그런 API는 `/own/users/*` 등 다른 프리픽스에 만든다.
 *    (`/own/auth/refresh`·`logout`은 이 래퍼를 쓰지 않아 여기에 걸리지 않는다)
 */
const PRE_AUTH_PATH_PREFIX = '/own/auth/'

const SESSION_EXPIRED_MESSAGE = '로그인이 만료되었습니다. 다시 로그인해 주세요.'
const SERVER_ERROR_MESSAGE =
  '서버 오류가 발생했습니다. 잠시 후 다시 시도하거나 관리자에게 문의해 주세요.'
const NETWORK_ERROR_MESSAGE =
  '네트워크 연결을 확인해 주세요. 연결이 불안정하거나 서버에 닿지 못했습니다.'
const DEFAULT_ERROR_MESSAGE = '요청을 처리하지 못했습니다.'

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

// 리프레시까지 실패한 경우 — 이제 로그인된 사용자의 토큰이 실제로 만료된 때만 도달한다.
// (인증 전 엔드포인트의 401은 PRE_AUTH_PATH_PREFIX 가드로 여기까지 오지 않는다)
function handleAuthFailure(redirectOn401: boolean): never {
  if (redirectOn401) {
    redirectToLogin()
  } else {
    clearUserAuthSession()
  }
  throw new Error(SESSION_EXPIRED_MESSAGE)
}

/**
 * 응답 본문의 message만 꺼낸다 (없으면 null).
 * `lib/api.ts`의 `getErrorMessage`와 같은 판별 — 두 래퍼의 공용화는 별건으로 남겨둔다.
 */
function extractMessage(body: unknown): string | null {
  if (typeof body !== 'object' || body === null || !('message' in body)) return null
  const { message } = body
  return typeof message === 'string' && message.length > 0 ? message : null
}

/**
 * 실패 응답 → 사용자에게 보여줄 오류.
 *
 * 4xx는 be 메시지를 그대로 쓴다 — be가 상황별 한국어 문구를 이미 관리하므로 단일 출처다.
 * 5xx는 쓰지 않는다: be는 500에 '서버 오류가 발생했습니다.'만 주고(errorHandler.ts),
 * 게이트웨이 오류(502·504)는 JSON이 아니라 statusText('Bad Gateway')가 영문으로 노출된다.
 */
async function toResponseError(res: Response): Promise<Error> {
  if (res.status >= 500) return new Error(SERVER_ERROR_MESSAGE)
  const body: unknown = await res.json().catch(() => null)
  return new Error(extractMessage(body) ?? DEFAULT_ERROR_MESSAGE)
}

// fetch는 HTTP 오류에는 throw하지 않고 네트워크 단절·CORS 실패에만 throw한다.
// 그대로 두면 'Failed to fetch'가 토스트에 영문으로 뜬다.
async function fetchOrThrow(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init)
  } catch {
    throw new Error(NETWORK_ERROR_MESSAGE)
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, redirectOn401 = true, ...rest } = options
  const accessToken = getUserAccessToken()

  const res = await fetchOrThrow(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: 'include',
  })

  // 401 → 리프레시 시도 → 재요청.
  // 인증 전 경로(로그인·회원가입 등)는 제외한다 — 그 401은 자격증명 오류이고,
  // 여기로 들어오면 be의 실제 사유가 "로그인이 만료되었습니다"로 덮인다.
  if (res.status === 401 && !path.startsWith(PRE_AUTH_PATH_PREFIX)) {
    const newToken = await getOrCreateRefreshPromise()

    if (!newToken) {
      handleAuthFailure(redirectOn401)
    }

    // 새 토큰으로 원래 요청 재시도
    const retryRes = await fetchOrThrow(`${API_BASE_URL}${path}`, {
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
      handleAuthFailure(redirectOn401)
    }

    if (!retryRes.ok) {
      throw await toResponseError(retryRes)
    }

    if (retryRes.status === 204) return undefined as T
    return retryRes.json() as Promise<T>
  }

  if (!res.ok) {
    throw await toResponseError(res)
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
