"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Brain, FileDown, FileText, FolderPlus, Sparkles, Zap } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import LanguageSwitcher from "@/components/language-switcher"
import SignUpDialog from "@/components/sign-up-dialog"
import { isAuthenticated } from "@/lib/auth-utils" // Fixed import path

export default function LandingPage() {
  const router = useRouter()
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isAuthenticated()) {
        router.push("/dashboard")
      } else {
        setIsLoading(false)
      }
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-neon-purple animate-pulse">{t("app.loading")}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pixel-bg scanlines flex flex-col">
      {/* Common background overlay for consistent color treatment */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80 pointer-events-none"></div>

      {/* Hero Section */}
      <div className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-neon-purple/20 via-transparent to-transparent"></div>

        {/* Header */}
        <header className="relative z-10 container mx-auto py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-neon-purple" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
              {t("app.name")}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/login">
              <Button variant="outline" className="border-neon-blue text-neon-blue hover:bg-neon-blue/10">
                {t("auth.login")}
              </Button>
            </Link>
            <Button
              className="bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90"
              onClick={() => setIsSignUpOpen(true)}
            >
              {t("auth.signup")}
            </Button>
          </div>
        </header>

        {/* Hero content */}
        <div className="relative z-10 container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 md:mb-10 bg-gradient-to-r from-neon-purple via-neon-blue to-neon-cyan bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
            {t("landing.hero.title")}
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-10 leading-relaxed md:leading-relaxed">
            {t("landing.hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 text-lg px-8"
              onClick={() => setIsSignUpOpen(true)}
            >
              {t("landing.hero.startFree")}
              <Zap className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 text-lg px-8"
            >
              {t("landing.hero.seeDemo")}
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-blue/50 to-transparent"></div>
      </div>

      {/* Features Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-purple/5 via-transparent to-neon-blue/5 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h3 className="text-3xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">
              {t("landing.features.title")}
            </span>
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-black/40 border border-neon-purple/20 rounded-lg p-6 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-full bg-neon-purple/10 flex items-center justify-center mb-4">
                  <FolderPlus className="h-6 w-6 text-neon-purple" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-neon-purple glow-text">
                  {t("landing.features.organize.title")}
                </h4>
                <p className="text-gray-300">{t("landing.features.organize.desc")}</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-black/40 border border-neon-blue/20 rounded-lg p-6 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-full bg-neon-blue/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-neon-blue" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-neon-blue glow-text">
                  {t("landing.features.create.title")}
                </h4>
                <p className="text-gray-300">{t("landing.features.create.desc")}</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-black/40 border border-neon-cyan/20 rounded-lg p-6 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-full bg-neon-cyan/10 flex items-center justify-center mb-4">
                  <FileDown className="h-6 w-6 text-neon-cyan" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-neon-cyan glow-text">
                  {t("landing.features.generate.title")}
                </h4>
                <p className="text-gray-300">{t("landing.features.generate.desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-blue/5 via-transparent to-neon-purple/5 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h3 className="text-3xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent">
              {t("landing.howItWorks.title")}
            </span>
          </h3>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-neon-purple/20 flex items-center justify-center mb-4 relative">
                <span className="text-2xl font-bold text-neon-purple">1</span>
                <div className="absolute inset-0 border border-neon-purple/30 rounded-full animate-pulse"></div>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-white">{t("landing.howItWorks.step1.title")}</h4>
              <p className="text-gray-400">{t("landing.howItWorks.step1.desc")}</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-neon-blue/20 flex items-center justify-center mb-4 relative">
                <span className="text-2xl font-bold text-neon-blue">2</span>
                <div className="absolute inset-0 border border-neon-blue/30 rounded-full animate-pulse"></div>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-white">{t("landing.howItWorks.step2.title")}</h4>
              <p className="text-gray-400">{t("landing.howItWorks.step2.desc")}</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-neon-cyan/20 flex items-center justify-center mb-4 relative">
                <span className="text-2xl font-bold text-neon-cyan">3</span>
                <div className="absolute inset-0 border border-neon-cyan/30 rounded-full animate-pulse"></div>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-white">{t("landing.howItWorks.step3.title")}</h4>
              <p className="text-gray-400">{t("landing.howItWorks.step3.desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-purple/5 via-transparent to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto bg-black/60 border border-neon-purple/30 rounded-xl p-8 md:p-12 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 via-neon-blue/5 to-transparent"></div>
            <div className="absolute top-0 right-0 -mt-10 -mr-10">
              <Sparkles className="h-32 w-32 text-neon-purple/10" />
            </div>

            <div className="relative z-10 text-center">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
                {t("landing.cta.title")}
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">{t("landing.cta.desc")}</p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 text-lg px-8"
                onClick={() => setIsSignUpOpen(true)}
              >
                {t("landing.hero.startFree")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800 relative mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Brain className="h-5 w-5 text-neon-purple" />
              <span className="text-lg font-semibold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
                {t("app.name")}
              </span>
            </div>
            <div className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} {t("app.name")}. {t("landing.footer.rights")}
            </div>
          </div>
        </div>
      </footer>

      {/* Sign Up Dialog */}
      <SignUpDialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen} />
    </div>
  )
}
