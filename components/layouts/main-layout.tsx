"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import NavigationTree from "@/components/navigation-tree"
import UserAccountButton from "@/components/user-account-button"
import LanguageSwitcher from "@/components/language-switcher"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("auth-token")
    if (!token) {
      router.push("/login")
    } else {
      setIsAuthenticated(true)
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-neon-purple animate-pulse">{t("app.loading")}</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in the useEffect
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="h-14 border-b flex items-center justify-between px-4 fancy-gradient-bg">
        <h1 className="text-xl font-bold text-white glow-text">{t("app.name")}</h1>
        <div className="flex items-center space-x-2">
          <LanguageSwitcher />
          <UserAccountButton />
        </div>
      </header>

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={25} minSize={20} maxSize={40} className="border-r bg-black/40">
          <NavigationTree />
        </ResizablePanel>
        <ResizablePanel defaultSize={75}>
          <main className="h-full overflow-auto p-4">{children}</main>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
