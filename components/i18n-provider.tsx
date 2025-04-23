"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { I18nextProvider } from "react-i18next"
import i18n from "@/lib/i18n"

interface I18nProviderProps {
  children: React.ReactNode
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize i18n on the client side
    if (!i18n.isInitialized) {
      i18n
        .init({
          resources: {
            en: {
              translation: require("@/translations/en.json"),
            },
            pl: {
              translation: require("@/translations/pl.json"),
            },
            de: {
              translation: require("@/translations/de.json"),
            },
          },
          fallbackLng: "en",
          debug: process.env.NODE_ENV === "development",
          interpolation: {
            escapeValue: false,
          },
          detection: {
            order: ["localStorage", "navigator"],
            lookupLocalStorage: "language",
            caches: ["localStorage"],
          },
        })
        .then(() => {
          setIsInitialized(true)
        })
    } else {
      setIsInitialized(true)
    }
  }, [])

  if (!isInitialized) {
    return null // Or a loading indicator
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
