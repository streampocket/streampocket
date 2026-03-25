'use client'

import { createContext, useContext, useState } from 'react'
import { Toaster } from 'sonner'

type UIContextValue = {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
}

const UIContext = createContext<UIContextValue | null>(null)

type UIProviderProps = {
  children: React.ReactNode
}

export function UIProvider({ children }: UIProviderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => setSidebarOpen((prev) => !prev)

  return (
    <UIContext.Provider value={{ sidebarOpen, setSidebarOpen, toggleSidebar }}>
      {children}
      <Toaster position="top-right" richColors />
    </UIContext.Provider>
  )
}

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI는 UIProvider 안에서만 사용 가능합니다.')
  return ctx
}
