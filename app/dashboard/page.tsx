"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import WelcomeContent from "@/components/welcome-content"
import { isAuthenticated } from "@/lib/auth-utils"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push("/login")
    }
  }, [router])

  return <WelcomeContent />
}
