"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Mock login - replace with actual authentication
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Store JWT token in localStorage or secure cookie
      localStorage.setItem("auth-token", "mock-jwt-token")

      // Redirect to dashboard page instead of root
      router.push("/dashboard")
    } catch (err) {
      setError("Nieprawidłowy email lub hasło. Spróbuj ponownie.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background relative">
      {/* Background gradient - now with pointer-events-none */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 via-neon-blue/5 to-neon-cyan/10 animate-gradient-shift"></div>
      </div>

      {/* Card with higher z-index */}
      <Card className="w-full max-w-md fancy-card bg-black/60 backdrop-blur-sm border-neon-blue/20 relative z-10">
        <CardHeader>
          <CardTitle className="text-2xl text-center bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            10x-knowtes
          </CardTitle>
          <CardDescription className="text-center">Zaloguj się do swojego konta</CardDescription>
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="twoj@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="border-neon-blue/30 bg-black/30 focus-visible:ring-neon-blue/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
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
              {isLoading ? "Logowanie..." : "Zaloguj się"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Nie masz konta?{" "}
            <Button
              variant="link"
              className="p-0 text-neon-cyan"
              onClick={() => alert("Funkcja rejestracji nie jest jeszcze dostępna")}
            >
              Zarejestruj się
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
