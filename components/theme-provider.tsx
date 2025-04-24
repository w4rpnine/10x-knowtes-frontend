"use client"

import type React from "react"
import { useEffect } from "react"

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: string
  disableSwitch?: boolean
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    // Ensure dark mode is applied immediately
    document.documentElement.classList.add('dark')
  }, [])

  return <>{children}</>
}
