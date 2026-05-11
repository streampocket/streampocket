'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { userApi } from '@/lib/userApi'
import type { OwnReview, ReviewImageUploadUrl } from '@/types/domain'

type SingleResponse = { data: OwnReview }
type UploadUrlResponse = { data: ReviewImageUploadUrl }

export function useOwnReview(reviewId: string | undefined) {
  return useQuery({
    queryKey: reviewId ? QUERY_KEYS.ownReviews.detail(reviewId) : ['ownReviews', 'noop'],
    queryFn: () => userApi.get<SingleResponse>(`/own/reviews/${reviewId}`),
    enabled: Boolean(reviewId),
    select: (res) => res.data,
  })
}

type CreatePayload = {
  applicationId: string
  content: string
  rating: number
  imageUrl: string | null
}

export function useCreateReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreatePayload) =>
      userApi.post<SingleResponse>('/own/reviews', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ownReviews.all() })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ownReviews.eligible() })
    },
  })
}

type UpdatePayload = {
  reviewId: string
  content: string
  rating: number
  imageUrl: string | null
}

export function useUpdateReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ reviewId, ...rest }: UpdatePayload) =>
      userApi.patch<SingleResponse>(`/own/reviews/${reviewId}`, rest),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ownReviews.all() })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ownReviews.detail(variables.reviewId) })
    },
  })
}

type UploadRequest = {
  contentType: 'image/jpeg' | 'image/png' | 'image/webp'
  contentLength: number
}

async function requestUploadUrl(body: UploadRequest): Promise<ReviewImageUploadUrl> {
  const res = await userApi.post<UploadUrlResponse>('/own/reviews/uploads/presigned-url', body)
  return res.data
}

export async function uploadReviewImage(file: File): Promise<string> {
  const contentType: UploadRequest['contentType'] = (() => {
    if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp') {
      return file.type
    }
    throw new Error('지원하지 않는 이미지 형식입니다. (jpg, png, webp만 가능)')
  })()

  const presigned = await requestUploadUrl({ contentType, contentLength: file.size })

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
