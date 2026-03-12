import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as SecureStore from "expo-secure-store";

import enCommon from "./locales/en/common.json";
import srCommon from "./locales/sr/common.json";
import esCommon from "./locales/es/common.json";
import enAuth from "./locales/en/auth.json";
import srAuth from "./locales/sr/auth.json";
import esAuth from "./locales/es/auth.json";
import enMatches from "./locales/en/matches.json";
import srMatches from "./locales/sr/matches.json";
import esMatches from "./locales/es/matches.json";

export const SUPPORTED_LANGUAGES = ["en", "sr", "es"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
const LANGUAGE_KEY = "app_language";

const resources = {
  en: { common: enCommon, auth: enAuth, matches: enMatches },
  sr: { common: srCommon, auth: srAuth, matches: srMatches },
  es: { common: esCommon, auth: esAuth, matches: esMatches },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

export async function getStoredLanguage(): Promise<SupportedLanguage | null> {
  const value = await SecureStore.getItemAsync(LANGUAGE_KEY);
  if (value && SUPPORTED_LANGUAGES.includes(value as SupportedLanguage)) {
    return value as SupportedLanguage;
  }
  return null;
}

export async function setStoredLanguage(language: SupportedLanguage): Promise<void> {
  await SecureStore.setItemAsync(LANGUAGE_KEY, language);
}

export async function hydrateLanguage(): Promise<void> {
  const storedLanguage = await getStoredLanguage();
  if (!storedLanguage || storedLanguage === i18n.language) return;
  await i18n.changeLanguage(storedLanguage);
}

export default i18n;
