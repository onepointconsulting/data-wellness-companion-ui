export const DEFAULT_LANGUAGE = "en"

export const supportedLanguages = [DEFAULT_LANGUAGE, "de"];

interface Map {
    [key: string]: string | undefined
}

export const supportedLanguagesLabels: Map = {
    "en": "English",
    "de": "German"
}