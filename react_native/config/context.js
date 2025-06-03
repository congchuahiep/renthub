import { createContext } from "react";

export const AuthContext = createContext({
	user: {},
	userLoading: false,
	login: async () => {},
	logout: async () => {},
});

export const ThemeSettingContext = createContext({
	themeMode: "auto",
	materialYou: true,
	setThemeMode: () => {},
	setMaterialYou: () => {},
});
