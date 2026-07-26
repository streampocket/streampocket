/** @type {import('next').NextConfig} */

// S3 호스트는 환경변수로 지정 (예: streampocket-reviews.s3.ap-northeast-2.amazonaws.com).
// 미설정 시 리뷰 이미지가 next/image로 표시되지 않을 수 있다.
const s3Hostname = process.env.NEXT_PUBLIC_REVIEW_IMAGE_HOSTNAME;

const nextConfig = {
  images: {
    // Vercel 이미지 최적화는 "이미지 × 크기 × 포맷" 조합 수로 과금(무료 5,000건)된다.
    // 기본 캐시 60초는 같은 이미지를 반복 재변환하므로 31일로 늘려 재변환을 막는다.
    // (정적 이미지는 배포마다 URL이 바뀌고, 업로드 이미지는 UUID 키라 내용이 바뀌지 않음)
    minimumCacheTTL: 60 * 60 * 24 * 31,
    // 생성 후보 크기 축소 (기본 각 8종 → 4종). 3840/2048은 실제 UI에 없는 크기인데
    // 원본보다 큰 업스케일 변환을 유발했다. formats에 avif를 추가하면 변환 수가 2배가 되므로 금지.
    deviceSizes: [640, 828, 1080, 1920],
    imageSizes: [64, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
      ...(s3Hostname
        ? [
            {
              protocol: 'https',
              hostname: s3Hostname,
              pathname: '/**',
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
