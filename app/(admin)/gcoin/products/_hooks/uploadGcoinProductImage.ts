'use client'

import { api } from '@/lib/api'
import { resizeImageFile } from '@/lib/resizeImage'

type UploadContentType = 'image/jpeg' | 'image/png' | 'image/webp'

type UploadUrl = {
  uploadUrl: string
  objectUrl: string
  key: string
}

/** 상품 이미지를 S3 presigned URL로 업로드하고 공개 URL을 반환한다. */
export async function uploadGcoinProductImage(file: File): Promise<string> {
  if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/webp') {
    throw new Error('지원하지 않는 이미지 형식입니다. (jpg, png, webp만 가능)')
  }

  // 업로드 전 축소 — presigned는 반드시 축소 결과 기준으로 요청해야 한다(서명에 타입·길이 포함).
  const resized = await resizeImageFile(file)
  const contentType: UploadContentType = resized.contentType

  const presigned = await api.post<UploadUrl>('/gcoin/admin/products/uploads/presigned-url', {
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
