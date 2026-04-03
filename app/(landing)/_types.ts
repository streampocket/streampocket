export type LandingBadgeTone = 'blue' | 'yellow' | 'purple' | 'green'

export type LandingNavItem = {
  href: string
  label: string
}

export type LandingProduct = {
  id: string
  name: string
  statusLabel: string
  statusTone: LandingBadgeTone
  priceLabel: string
  accentClassName: string
}

export type LandingStep = {
  id: string
  title: string
  description: string
}

export type LandingVideo = {
  id: string
  title: string
  description: string
  thumbnailLabel: string
}

export type LandingTrustItem = {
  id: string
  title: string
  description: string
}

export type LandingFaq = {
  id: string
  question: string
  answer: string
}
