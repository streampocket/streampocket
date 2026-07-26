// 업로드 전 클라이언트 이미지 축소.
// 휴대폰 원본(4000px·5MB)이 그대로 올라가면 Vercel 이미지 변환 비용과 로딩 시간이 커지므로,
// 업로드 시점에 긴 변 기준으로 줄이고 WebP로 재인코딩한다.
// 서버는 파일 바이트를 경유하지 않는 구조(브라우저 → S3 직접 PUT)라 여기가 유일한 가공 지점이다.

export const UPLOAD_IMAGE_MAX_SIZE = 1600
const UPLOAD_IMAGE_QUALITY = 0.85

export type ResizedImage = {
  blob: Blob
  contentType: 'image/jpeg' | 'image/png' | 'image/webp'
}

function isSupportedType(type: string): type is ResizedImage['contentType'] {
  return type === 'image/jpeg' || type === 'image/png' || type === 'image/webp'
}

/**
 * 이미지를 긴 변 maxSize 이하로 줄이고 WebP Blob으로 반환한다.
 * - EXIF 회전을 반영해야 아이폰 세로 사진이 눕지 않는다 (imageOrientation: 'from-image')
 * - 이미 충분히 작거나 변환에 실패하면 원본을 그대로 반환한다 (업로드 자체를 막지 않기 위함)
 *
 * ⚠️ 반환된 blob의 size·type으로 presigned URL을 요청해야 한다.
 *    presigned 서명에 content-type·length가 포함되어 있어 불일치 시 S3가 403을 반환한다.
 */
export async function resizeImageFile(
  file: File,
  options?: { maxSize?: number; quality?: number },
): Promise<ResizedImage> {
  const maxSize = options?.maxSize ?? UPLOAD_IMAGE_MAX_SIZE
  const quality = options?.quality ?? UPLOAD_IMAGE_QUALITY
  const fallback: ResizedImage = {
    blob: file,
    contentType: isSupportedType(file.type) ? file.type : 'image/jpeg',
  }

  if (typeof window === 'undefined' || typeof createImageBitmap !== 'function') {
    return fallback
  }

  let bitmap: ImageBitmap | null = null
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })

    const longestSide = Math.max(bitmap.width, bitmap.height)
    const scale = longestSide > maxSize ? maxSize / longestSide : 1
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return fallback
    ctx.drawImage(bitmap, 0, 0, width, height)

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((result) => resolve(result), 'image/webp', quality)
    })
    // toBlob 실패(WebP 미지원 등)하거나 오히려 커졌으면 원본 사용
    if (!blob || blob.size >= file.size) return fallback

    return { blob, contentType: 'image/webp' }
  } catch {
    return fallback
  } finally {
    bitmap?.close()
  }
}
