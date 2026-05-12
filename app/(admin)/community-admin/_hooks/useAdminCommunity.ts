'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { api } from '@/lib/api'
import type {
  CommunityCategory,
  CommunityPost,
  CommunityPostListResponse,
} from '@/types/domain'

type ListParams = { page: number; category?: CommunityCategory }
type UploadUrl = { uploadUrl: string; objectUrl: string; key: string }

export function useAdminCommunityPosts(params: ListParams) {
  return useQuery({
    queryKey: QUERY_KEYS.adminCommunity.list(params),
    queryFn: () => {
      const search = new URLSearchParams()
      search.set('page', String(params.page))
      if (params.category) search.set('category', params.category)
      return api.get<CommunityPostListResponse>(
        `/admin/community/posts?${search.toString()}`,
      )
    },
  })
}

type CreatePayload = {
  category: CommunityCategory
  title: string
  content: string
  imageUrl: string | null
}

export function useAdminCreatePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreatePayload) =>
      api.post<CommunityPost>('/admin/community/posts', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.adminCommunity.all() })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.community.all() })
    },
  })
}

type UpdatePayload = {
  postId: string
  category: CommunityCategory
  title: string
  content: string
  imageUrl: string | null
}

export function useAdminUpdatePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ postId, ...rest }: UpdatePayload) =>
      api.patch<CommunityPost>(`/admin/community/posts/${postId}`, rest),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.adminCommunity.all() })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.community.all() })
    },
  })
}

export function useAdminDeletePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (postId: string) =>
      api.delete<void>(`/admin/community/posts/${postId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.adminCommunity.all() })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.community.all() })
    },
  })
}

type UploadRequest = {
  contentType: 'image/jpeg' | 'image/png' | 'image/webp'
  contentLength: number
}

export async function uploadAdminCommunityImage(file: File): Promise<string> {
  const contentType: UploadRequest['contentType'] = (() => {
    if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp') {
      return file.type
    }
    throw new Error('지원하지 않는 이미지 형식입니다.')
  })()

  const presigned = await api.post<UploadUrl>('/admin/community/uploads/presigned-url', {
    contentType,
    contentLength: file.size,
  })

  const putRes = await fetch(presigned.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: file,
  })
  if (!putRes.ok) {
    throw new Error('이미지 업로드에 실패했습니다.')
  }
  return presigned.objectUrl
}
