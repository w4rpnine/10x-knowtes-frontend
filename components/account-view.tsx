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
        description: "Nowe hasło i potwierdzenie hasła nie są identyczne.",
        variant: "destructive",
      })
      return
    }

    try {
      // In a real app, change password here
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast({
        title: "Hasło zmienione",
        description: "Twoje hasło zostało pomyślnie zmienione.",
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
        <h1 className="text-2xl font-bold tracking-tight">Konto użytkownika</h1>
        <p className="text-muted-foreground">Zarządzaj swoim kontem i ustawieniami.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informacje o koncie</CardTitle>
          <CardDescription>Podstawowe informacje o Twoim koncie.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>UUID użytkownika</Label>
            <div className="flex">
              <Input value={user.id} readOnly className="font-mono bg-muted" />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Email</Label>
            <div className="flex">
              <Input value={user.email} readOnly className="bg-muted" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={handleLogout}>
            Wyloguj się
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zmień hasło</CardTitle>
          <CardDescription>Zaktualizuj swoje hasło, aby zabezpieczyć konto.</CardDescription>
        </CardHeader>
        <form onSubmit={handleChangePassword}>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="current-password">Obecne hasło</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new-password">Nowe hasło</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirm-password">Potwierdź nowe hasło</Label>
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
            <Button type="submit">Zmień hasło</Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Usuń konto</CardTitle>
          <CardDescription>Trwale usuń swoje konto i wszystkie dane.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Po usunięciu konta, wszystkie Twoje dane zostaną trwale usunięte. Tej operacji nie można cofnąć.
          </p>
        </CardContent>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Usuń konto</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Czy na pewno chcesz usunąć swoje konto?</AlertDialogTitle>
                <AlertDialogDescription>
                  Ta operacja trwale usunie Twoje konto i wszystkie dane. Tej operacji nie można cofnąć.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Anuluj</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Usuń konto
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  )
}
