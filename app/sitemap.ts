import type { MetadataRoute } from 'next'
import { API_BASE_URL } from '@/constants/app'

type ProductListItem = {
  id: string
}

async function fetchProductIds(): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/own/products?status=recruiting`, {
      next: { revalidate: 86400 },
    })
    if (!res.ok) return []
    const json = await res.json() as { data: ProductListItem[] }
    return json.data.map((p) => p.id)
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ottall.com'

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/party`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/signin`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/guide`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ]

  const productIds = await fetchProductIds()
  const productPages: MetadataRoute.Sitemap = productIds.map((id) => ({
    url: `${baseUrl}/party/${id}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...productPages]
}
