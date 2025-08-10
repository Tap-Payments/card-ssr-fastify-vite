import { ThemeMode, SuperThemeMode } from "@shared/types";

export const getSuperThemeMode = (themeMode: ThemeMode): SuperThemeMode =>
  themeMode.includes("light") ? SuperThemeMode.LIGHT : SuperThemeMode.DARK;
