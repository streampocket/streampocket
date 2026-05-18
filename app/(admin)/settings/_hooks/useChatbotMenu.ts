'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { api } from '@/lib/api'
import type { ApiResponse } from '@/types/api'
import type { ChatbotMenuButton, ChatbotMenuItem, ChatbotMenuOverview } from '@/types/domain'

const BASE = '/steam/admin/chatbot-menus'

export type ChatbotMenuItemInput = {
  label: string
  body: string
  imageUrl: string | null
  buttons: ChatbotMenuButton[]
  isActive: boolean
}

type UploadUrl = { uploadUrl: string; objectUrl: string; key: string }

export function useChatbotMenu() {
  const queryClient = useQueryClient()
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chatbotMenu.all() })

  const query = useQuery({
    queryKey: QUERY_KEYS.chatbotMenu.all(),
    queryFn: () => api.get<ApiResponse<ChatbotMenuOverview>>(BASE),
    select: (response) => response.data,
  })

  const updateWelcome = useMutation({
    mutationFn: (welcomeMessage: string | null) =>
      api.put<ApiResponse<{ welcomeMessage: string | null }>>(`${BASE}/welcome`, {
        welcomeMessage,
      }),
    onSuccess: () => {
      toast.success('웰컴 인사말이 저장되었습니다.')
      invalidate()
    },
    onError: (error: Error) => toast.error(error.message ?? '저장에 실패했습니다.'),
  })

  const createItem = useMutation({
    mutationFn: (input: ChatbotMenuItemInput) =>
      api.post<ApiResponse<ChatbotMenuItem>>(BASE, input),
    onSuccess: () => {
      toast.success('메뉴가 추가되었습니다.')
      invalidate()
    },
    onError: (error: Error) => toast.error(error.message ?? '추가에 실패했습니다.'),
  })

  const updateItem = useMutation({
    mutationFn: ({ id, ...input }: ChatbotMenuItemInput & { id: string }) =>
      api.patch<ApiResponse<ChatbotMenuItem>>(`${BASE}/${id}`, input),
    onSuccess: () => {
      toast.success('메뉴가 수정되었습니다.')
      invalidate()
    },
    onError: (error: Error) => toast.error(error.message ?? '수정에 실패했습니다.'),
  })

  const deleteItem = useMutation({
    mutationFn: (id: string) => api.delete<ApiResponse<{ id: string }>>(`${BASE}/${id}`),
    onSuccess: () => {
      toast.success('메뉴가 삭제되었습니다.')
      invalidate()
    },
    onError: (error: Error) => toast.error(error.message ?? '삭제에 실패했습니다.'),
  })

  const reorder = useMutation({
    mutationFn: (orderedIds: string[]) =>
      api.put<ApiResponse<ChatbotMenuItem[]>>(`${BASE}/reorder`, { orderedIds }),
    onSuccess: () => invalidate(),
    onError: (error: Error) => toast.error(error.message ?? '순서 변경에 실패했습니다.'),
  })

  return { query, updateWelcome, createItem, updateItem, deleteItem, reorder }
}

// 챗봇 메뉴 이미지 업로드 — presigned URL 발급 후 S3 PUT, objectUrl 반환
export async function uploadChatbotMenuImage(file: File): Promise<string> {
  const contentType = (() => {
    if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp') {
      return file.type
    }
    throw new Error('지원하지 않는 이미지 형식입니다. (jpg, png, webp만 가능)')
  })()

  const presigned = await api.post<ApiResponse<UploadUrl>>(`${BASE}/image-upload-url`, {
    contentType,
    contentLength: file.size,
  })

  const putRes = await fetch(presigned.data.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: file,
  })
  if (!putRes.ok) throw new Error('이미지 업로드에 실패했습니다.')
  return presigned.data.objectUrl
}
