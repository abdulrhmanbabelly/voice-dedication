export const getThemeColors = (): {
  colorText: string;
  colorBackground: string;
  colorPrimary: string;
} => {
  const rootElement = document.querySelector(":root") as HTMLElement;
  const colorText = rootElement?.style?.getPropertyValue("--color-text");
  const colorBackground =
    rootElement?.style?.getPropertyValue("--color-background");
  const colorPrimary = rootElement?.style?.getPropertyValue("--color-primary");
  return {
    colorText,
    colorBackground,
    colorPrimary,
  };
};
