"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Check } from "lucide-react"

// Language options with their flags and names
const languages = [
  {
    code: "en",
    name: "English",
    flag: "🇬🇧",
    label: "English",
  },
  {
    code: "pl",
    name: "Polski",
    flag: "🇵🇱",
    label: "Polski",
  },
  {
    code: "de",
    name: "Deutsch",
    flag: "🇩🇪",
    label: "Deutsch",
  },
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "en")

  // Load the saved language preference on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en"
    setCurrentLanguage(savedLanguage)
    i18n.changeLanguage(savedLanguage)
  }, [i18n])

  const handleLanguageChange = (languageCode: string) => {
    setCurrentLanguage(languageCode)
    localStorage.setItem("language", languageCode)
    i18n.changeLanguage(languageCode)

    // Optionally reload the page to apply language changes
    // window.location.reload();
  }

  // Find the current language object
  const currentLang = languages.find((lang) => lang.code === currentLanguage) || languages[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <span className="text-lg">{currentLang.flag}</span>
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-black/80 border-neon-blue/30 backdrop-blur-sm">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center">
              <span className="mr-2 text-lg">{language.flag}</span>
              {language.label}
            </span>
            {currentLanguage === language.code && <Check className="h-4 w-4 ml-2 text-neon-green" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
