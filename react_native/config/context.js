import { createContext } from "react";

export const AuthContext = createContext({
	user: {},
	loading: false,
	login: () => {},
	logout: () => {},
});

export const ThemeSettingContext = createContext({
	themeMode: "auto",
	materialYou: true,
	setThemeMode: () => {},
	setMaterialYou: () => {},
});
