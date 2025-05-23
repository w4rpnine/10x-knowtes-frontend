"use client"

import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut } from "lucide-react"
import { clearAuthToken } from "@/lib/auth-utils"
import { getApiBaseUrl } from "@/lib/config"

export default function UserAccountButton() {
  const router = useRouter()
  const { t } = useTranslation()

  const handleNavigateToAccount = () => {
    router.push("/account")
  }

  const handleLogout = async () => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        },
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Logout failed")
      }

      clearAuthToken()
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
      // Still clear token and redirect even if the API call fails
      clearAuthToken()
      router.push("/")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
          <span className="sr-only">{t("topic.account")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t("auth.logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
