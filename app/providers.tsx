"use client"

import type React from "react"
import { useEffect } from "react"
import { DeleteConfirmationProvider } from "@/hooks/use-delete-confirmation"
import "@/lib/i18n" // Import i18n configuration
import { clearAuthToken, getAuthToken } from "@/lib/auth-utils"

export function Providers({ children }: { children: React.ReactNode }) {
  // Initialize i18n and check for valid tokens
  useEffect(() => {
    // This effect ensures i18n is initialized on the client side

    // Check if there's a token that might be invalid or leftover from testing
    const token = getAuthToken()
    if (token && (token === "mock-jwt-token" || token === "test-token")) {
      console.log("Clearing potentially invalid token:", token)
      clearAuthToken()
    }
  }, [])

  return <DeleteConfirmationProvider>{children}</DeleteConfirmationProvider>
}
