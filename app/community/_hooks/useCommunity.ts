'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { userApi } from '@/lib/userApi'
import { resizeImageFile } from '@/lib/resizeImage'
import type {
  CommunityCategory,
  CommunityPost,
  CommunityPostListResponse,
} from '@/types/domain'

type UploadUrl = { uploadUrl: string; objectUrl: string; key: string }

type ListParams = { page: number; category?: CommunityCategory }

export function useCommunityPosts(params: ListParams) {
  return useQuery({
    queryKey: QUERY_KEYS.community.list(params),
    queryFn: async () => {
      const search = new URLSearchParams()
      search.set('page', String(params.page))
      if (params.category) search.set('category', params.category)
      return userApi.get<CommunityPostListResponse>(`/community/posts?${search.toString()}`)
    },
  })
}

export function useCommunityPost(id: string | undefined) {
  return useQuery({
    queryKey: id ? QUERY_KEYS.community.detail(id) : ['community', 'detail', 'noop'],
    queryFn: () => userApi.get<CommunityPost>(`/community/posts/${id}`),
    enabled: Boolean(id),
  })
}

type CreatePayload = {
  title: string
  content: string
  imageUrl: string | null
}

export function useCreateCommunityPost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreatePayload) =>
      userApi.post<CommunityPost>('/community/posts', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.community.all() })
    },
  })
}

type UpdatePayload = {
  postId: string
  title: string
  content: string
  imageUrl: string | null
}

export function useUpdateCommunityPost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ postId, ...rest }: UpdatePayload) =>
      userApi.patch<CommunityPost>(`/community/posts/${postId}`, rest),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.community.all() })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.community.detail(vars.postId) })
    },
  })
}

export function useDeleteCommunityPost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (postId: string) => userApi.delete<void>(`/community/posts/${postId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.community.all() })
    },
  })
}

type UploadRequest = {
  contentType: 'image/jpeg' | 'image/png' | 'image/webp'
  contentLength: number
}

export async function uploadCommunityImage(file: File): Promise<string> {
  if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/webp') {
    throw new Error('지원하지 않는 이미지 형식입니다. (jpg, png, webp만 가능)')
  }

  // 업로드 전 축소 — presigned는 반드시 축소 결과 기준으로 요청해야 한다(서명에 타입·길이 포함).
  const resized = await resizeImageFile(file)
  const contentType: UploadRequest['contentType'] = resized.contentType

  const presigned = await userApi.post<UploadUrl>('/community/uploads/presigned-url', {
    contentType,
    contentLength: resized.blob.size,
  })

  const putRes = await fetch(presigned.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: resized.blob,
  })
  if (!putRes.ok) {
    throw new Error('이미지 업로드에 실패했습니다.')
  }
  return presigned.objectUrl
}
