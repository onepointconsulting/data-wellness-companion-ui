import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import englishTranslation from "./Locales/en/translation.json";
import farsiTranslation from "./Locales/fa/translation.json";
import germanTranslation from "./Locales/de/translation.json";

export const DEFAULT_LANGUAGE = "en";

const resources = {
  en: {
    translations: englishTranslation,
  },
  fa: {
    translations: farsiTranslation,
  },
  de: {
    translations: germanTranslation,
  },
};

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    debug: true,

    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;
