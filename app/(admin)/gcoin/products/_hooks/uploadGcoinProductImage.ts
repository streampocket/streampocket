'use client'

import { api } from '@/lib/api'

type UploadContentType = 'image/jpeg' | 'image/png' | 'image/webp'

type UploadUrl = {
  uploadUrl: string
  objectUrl: string
  key: string
}

/** 상품 이미지를 S3 presigned URL로 업로드하고 공개 URL을 반환한다. */
export async function uploadGcoinProductImage(file: File): Promise<string> {
  const contentType: UploadContentType = (() => {
    if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp') {
      return file.type
    }
    throw new Error('지원하지 않는 이미지 형식입니다. (jpg, png, webp만 가능)')
  })()

  const presigned = await api.post<UploadUrl>('/gcoin/admin/products/uploads/presigned-url', {
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
