/** @type {import('next').NextConfig} */

// S3 호스트는 환경변수로 지정 (예: streampocket-reviews.s3.ap-northeast-2.amazonaws.com).
// 미설정 시 리뷰 이미지가 next/image로 표시되지 않을 수 있다.
const s3Hostname = process.env.NEXT_PUBLIC_REVIEW_IMAGE_HOSTNAME;

const nextConfig = {
  images: {
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
