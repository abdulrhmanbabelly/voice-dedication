import {
  BaseDirectory,
  exists,
  readTextFile,
  writeFile,
} from "@tauri-apps/plugin-fs";

export interface Language {
  value: string;
  dir: string;
}
interface Config {
  language: Language;
  model: string;
  darkMode: boolean;
}

type UpdatedSetting =
  | { model?: string }
  | { language?: Language }
  | { darkMode?: boolean };
export const createConfig = () => {
  const defaultConfig: Config = {
    language: {
      value: "en",
      dir: "ltr",
    },
    model: "",
    darkMode: false,
  };

  exists("config.json", { baseDir: BaseDirectory.AppData }).then((isExist) => {
    if (isExist)
      readTextFile("config.json", { baseDir: BaseDirectory.AppData }).then(
        (configData) => localStorage.setItem("config", configData)
      );
    else {
      let encoder = new TextEncoder();
      let defaultConfigData = encoder.encode(JSON.stringify(defaultConfig));
      writeFile("config.json", defaultConfigData, {
        baseDir: BaseDirectory.AppData,
      }).then(() => console.log("###### CREATED DEFAULT CONFIG ######"));
    }
  });
};

export const getConfig = (): Config => {
  const config = localStorage.getItem("config");
  if (config) return JSON.parse(config);
  else throw new Error("COULD NOT GET CONFIG");
};

export const config = $state(getConfig());
export const updateConfig = (updatedSetting: UpdatedSetting) => {
  const updatedConfig: Config = { ...config, ...updatedSetting };
  config.darkMode = updatedConfig.darkMode;
  config.language = updatedConfig.language;
  config.model = updatedConfig.model;

  localStorage.setItem("config", JSON.stringify(updatedConfig));
  let encoder = new TextEncoder();
  let ConfigData = encoder.encode(JSON.stringify(updatedConfig));
  writeFile("config.json", ConfigData, {
    baseDir: BaseDirectory.AppData,
  }).then(() => console.log("###### UPDATED CONFIG ######"));
};

export const modelDialogOpen = $state({ isOpen: false });
