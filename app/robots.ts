import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/login', '/dashboard', '/products', '/orders', '/codes', '/revenue', '/settings'],
      },
      {
        userAgent: 'Yeti',
        allow: '/',
      },
    ],
    sitemap: 'https://ottall.com/sitemap.xml',
  }
}
