"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import SignUpDialog from "@/components/sign-up-dialog"
import LanguageSwitcher from "@/components/language-switcher"
import { isAuthenticated, setAuthToken } from "@/lib/auth-utils"
import { getApiBaseUrl } from "@/lib/config"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const router = useRouter()
  const { t } = useTranslation()

  // Add this useEffect if the login page also checks authentication
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      if (isAuthenticated()) {
        router.push("/dashboard")
      }
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Nieprawidłowy email lub hasło.');
      }
      
      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("expires_at", data.expires_at);
      
      router.push("/dashboard")
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(t("auth.loginError"))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen pixel-bg scanlines relative">
      {/* Background gradient - now with pointer-events-none */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 via-neon-blue/5 to-neon-cyan/10 animate-gradient-shift"></div>
      </div>

      {/* Language switcher in the top-right corner */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      {/* Card with higher z-index */}
      <Card className="w-full max-w-md fancy-card bg-black/60 backdrop-blur-sm border-neon-blue/20 relative z-10">
        <CardHeader>
          <CardTitle className="text-2xl text-center bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            {t("app.name")}
          </CardTitle>
          <CardDescription className="text-center">{t("auth.login")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("auth.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="border-neon-blue/30 bg-black/30 focus-visible:ring-neon-blue/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="border-neon-blue/30 bg-black/30 focus-visible:ring-neon-blue/50"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? t("auth.loggingIn") : t("auth.loginButton")}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {t("auth.noAccount")}{" "}
            <Button variant="link" className="p-0 text-neon-cyan" onClick={() => setIsSignUpOpen(true)}>
              {t("auth.signup")}
            </Button>
          </p>
        </CardFooter>
      </Card>

      {/* Sign Up Dialog */}
      <SignUpDialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen} />
    </div>
  )
}
