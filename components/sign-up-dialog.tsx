"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { setAuthToken } from "@/lib/auth-utils"
import { getApiBaseUrl } from "@/lib/config"

interface SignUpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SignUpDialog({ open, onOpenChange }: SignUpDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useTranslation()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [password_confirmation, setPasswordConfirmation] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate form
    if (!name.trim()) {
      setError(t("auth.nameRequired"))
      return
    }

    if (!email.trim()) {
      setError(t("auth.emailRequired"))
      return
    }

    if (!password) {
      setError(t("auth.passwordRequired"))
      return
    }

    if (password.length < 8) {
      setError(t("auth.passwordLength"))
      return
    }

    if (password !== password_confirmation) {
      setError(t("auth.passwordsNotMatch"))
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          email,
          password,
          password_confirmation
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Nie udało się utworzyć konta.');
      }

      toast({
        title: t("auth.accountCreated"),
        description: t("auth.accountCreatedDesc"),
      })

      // Close dialog and redirect to dashboard
      onOpenChange(false)
      router.push("/login")
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(t("auth.signupError"))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-black/80 border-neon-purple/30 backdrop-blur-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl text-center bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
              {t("auth.createAccount")}
            </DialogTitle>
            <DialogDescription className="text-center">{t("auth.createAccountDesc")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">{t("auth.name")}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-neon-purple/30 bg-black/30 focus-visible:ring-neon-purple/50"
                placeholder="Jan Kowalski"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-email">{t("auth.email")}</Label>
              <Input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-neon-purple/30 bg-black/30 focus-visible:ring-neon-purple/50"
                placeholder={t("auth.emailPlaceholder")}
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password">{t("auth.password")}</Label>
              <Input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-neon-purple/30 bg-black/30 focus-visible:ring-neon-purple/50"
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">{t("auth.password_confirmation")}</Label>
              <Input
                id="confirm-password"
                type="password"
                value={password_confirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="border-neon-purple/30 bg-black/30 focus-visible:ring-neon-purple/50"
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-muted-foreground text-muted-foreground hover:bg-muted/10"
              disabled={isLoading}
            >
              {t("navigation.cancel")}
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? t("auth.creatingAccount") : t("auth.signupButton")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
