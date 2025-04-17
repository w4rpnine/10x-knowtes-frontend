"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import WelcomeContent from "@/components/welcome-content"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("auth-token")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  return <WelcomeContent />
}
