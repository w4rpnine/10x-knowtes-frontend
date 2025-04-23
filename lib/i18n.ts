import i18next from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

// Import translations
import enTranslation from "@/translations/en.json"
import plTranslation from "@/translations/pl.json"
import deTranslation from "@/translations/de.json"

// Initialize i18next
const i18nConfig = {
  resources: {
    en: {
      translation: enTranslation,
    },
    pl: {
      translation: plTranslation,
    },
    de: {
      translation: deTranslation,
    },
  },
  fallbackLng: "en",
  debug: process.env.NODE_ENV === "development",
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  detection: {
    order: ["localStorage", "navigator"],
    lookupLocalStorage: "language",
    caches: ["localStorage"],
  },
}

// Check if we're on the client side before initializing
if (typeof window !== "undefined") {
  i18next.use(LanguageDetector).use(initReactI18next).init(i18nConfig)
}

export default i18next
