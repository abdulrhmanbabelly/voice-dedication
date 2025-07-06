import { getConfig } from "./config";

const translation: Record<string, Record<string, string>> = {
  ["عربي"]: {
    settings: "الإعدادات",
    listening: "...يستمع",
    not_listening: "مطفئ",
    interface_language: "لغة الواجهة",
    theme: "النمط المظلم",
    model: "النموذج",
    none: "لا يوجد",
  },
  ["English"]: {
    settings: "settings",
    listening: "Listening...",
    not_listening: "Start voice typing",
    interface_language: "Interface Language",
    theme: "Dark mode",
    model: "Model",
    none: "None",
  },
};

export const translate = (key: string): string => {
  const config = getConfig();
  const lang: string = config.language.value ?? "en";
  if (!key) return "";
  if (!translation[lang]) return "";
  return translation[lang][key] ?? "";
};
