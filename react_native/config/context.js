import { createContext } from "react";

export const UserContext= createContext();

export const MyDispatchContext= createContext();

export const ThemeSettingContext = createContext({
  themeMode: "auto",
  materialYou: true,
  setThemeMode: () => {},
  setMaterialYou: () => {},
});