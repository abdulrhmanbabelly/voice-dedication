import {
  BaseDirectory,
  exists,
  readTextFile,
  writeFile,
} from "@tauri-apps/plugin-fs";

interface Config {
  language: {
    value: string;
    dir: string;
  };
  model: string;
  darkMode: boolean;
}

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

export const updateConfig = (config: Config) => {
  localStorage.setItem("config", JSON.stringify(config));
  let encoder = new TextEncoder();
  let ConfigData = encoder.encode(JSON.stringify(config));
  writeFile("config.json", ConfigData, {
    baseDir: BaseDirectory.AppData,
  }).then(() => console.log("###### UPDATED CONFIG ######"));

  setTimeout(() => {
    location.reload();
  }, 200);
};

export const getConfig = (): Config => {
  const config = localStorage.getItem("config");
  if (config) return JSON.parse(config);
  else throw new Error("COULD NOT GET CONFIG");
};
