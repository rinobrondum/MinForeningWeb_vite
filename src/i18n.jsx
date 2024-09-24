import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import customLanguageDetector from 'lib/domainLanguageDetector'

const languageDetector = new LanguageDetector()
languageDetector.addDetector(customLanguageDetector)

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV === 'development',
    fallbackLng: 'da',
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
    iterpolation: {
      escapeValue: false,
    },
    keySeparator: false,
    // resources: locales,
    supportedLngs: ['da', 'en', 'de', 'no', 'es', 'sk', 'cz', 'pl'],
    saveMissing: true,
    saveMissingTo: 'all',
    saveMissingPlurals: true,
    react: {
      wait: true,
    },
    detection: {
      order: ['domainLanguageDetector', 'localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
    },
  })

export default i18n
