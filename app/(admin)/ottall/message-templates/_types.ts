export type MessageTemplate = {
  id: string
  name: string
  content: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type MessageTemplateInput = {
  name: string
  content: string
}
