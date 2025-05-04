"use client"

import type React from "react"
import { useEffect } from "react"
import { DeleteConfirmationProvider } from "@/hooks/use-delete-confirmation"
import I18nProvider from "@/components/i18n-provider"
import { clearAuthToken, getAuthToken } from "@/lib/auth-utils"

export function Providers({ children }: { children: React.ReactNode }) {
  // Check for valid tokens
  useEffect(() => {
    // Check if there's a token that might be invalid or leftover from testing
    const token = getAuthToken()
    if (token && (token === "mock-jwt-token" || token === "test-token")) {
      clearAuthToken()
    }
  }, [])

  return (
    <I18nProvider>
      <DeleteConfirmationProvider>{children}</DeleteConfirmationProvider>
    </I18nProvider>
  )
}
