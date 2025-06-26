import { getConfig } from "./config";

const translation: Record<string, Record<string, string>> = {
  ["عربي"]: {
    settings: "الإعدادات",
    listening: "...يستمع",
    not_listening: "مطفئ",
    interface_language: "لغة الواجهة",
    theme: "النمط",
    model: "النموذج",
  },
  ["English"]: {
    settings: "settings",
    listening: "listening...",
    not_listening: "off",
    interface_language: "Interface Language",
    theme: "Theme",
    model: "Model",
  },
};

export const translate = (key: string): string => {
  const config = getConfig();
  const lang: string = config.language.value ?? "en";
  return translation[lang][key] ?? "";
};
