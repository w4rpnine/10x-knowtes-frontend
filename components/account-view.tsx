"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"

// Mock user data
const mockUser = {
  id: "user-123456",
  email: "user@example.com",
}

export default function AccountView() {
  const router = useRouter()
  const { toast } = useToast()
  const [user] = useState(mockUser)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const { t } = useTranslation()

  const handleLogout = () => {
    // Clear auth token
    localStorage.removeItem("auth-token")
    router.push("/login")
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast({
        title: "Błąd",
        description: t("account.passwordError"),
        variant: "destructive",
      })
      return
    }

    try {
      // In a real app, change password here
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast({
        title: t("account.passwordChanged"),
        description: t("account.passwordChangedDesc"),
      })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się zmienić hasła.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAccount = async () => {
    try {
      // In a real app, delete account here
      await new Promise((resolve) => setTimeout(resolve, 500))
      localStorage.removeItem("auth-token")
      router.push("/login")
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się usunąć konta.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("account.title")}</h1>
        <p className="text-muted-foreground">{t("account.subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("account.accountInfo")}</CardTitle>
          <CardDescription>{t("account.accountInfoDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>{t("account.userId")}</Label>
            <div className="flex">
              <Input value={user.id} readOnly className="font-mono bg-muted" />
            </div>
          </div>
          <div className="space-y-1">
            <Label>{t("account.email")}</Label>
            <div className="flex">
              <Input value={user.email} readOnly className="bg-muted" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={handleLogout}>
            {t("auth.logout")}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("account.changePassword")}</CardTitle>
          <CardDescription>{t("account.changePasswordDesc")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleChangePassword}>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="current-password">{t("account.currentPassword")}</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new-password">{t("account.newPassword")}</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirm-password">{t("account.confirmNewPassword")}</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">{t("account.changePassword")}</Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">{t("account.deleteAccount")}</CardTitle>
          <CardDescription>{t("account.deleteAccountDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t("account.deleteAccountWarning")}</p>
        </CardContent>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">{t("account.deleteAccount")}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("account.deleteAccountConfirm")}</AlertDialogTitle>
                <AlertDialogDescription>{t("account.deleteAccountConfirmDesc")}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("navigation.cancel")}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {t("account.deleteAccount")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  )
}
