import { YOUTUBE_CHANNELS } from '@/constants/app'
import type { LandingVideo } from '@/app/(landing)/_types'

function extractVideoId(xml: string): string | null {
  const match = xml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)
  return match ? match[1] : null
}

function extractTitle(xml: string): string | null {
  const entryMatch = xml.match(/<entry>[\s\S]*?<\/entry>/)
  if (!entryMatch) return null
  const titleMatch = entryMatch[0].match(/<title>([^<]+)<\/title>/)
  return titleMatch ? titleMatch[1] : null
}

async function fetchChannelLatestVideo(
  channelName: string,
  channelId: string,
): Promise<LandingVideo | null> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { next: { revalidate: 86400 } },
    )
    if (!res.ok) return null

    const xml = await res.text()
    const videoId = extractVideoId(xml)
    const title = extractTitle(xml)

    if (!videoId || !title) return null

    return {
      channelName,
      videoId,
      title,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    }
  } catch {
    return null
  }
}

export async function fetchLatestVideos(): Promise<LandingVideo[]> {
  const results = await Promise.all(
    YOUTUBE_CHANNELS.map((ch) => fetchChannelLatestVideo(ch.name, ch.channelId)),
  )
  return results.filter((v): v is LandingVideo => v !== null)
}
