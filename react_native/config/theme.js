import { useMaterial3Theme, createMaterial3Theme } from "@pchmn/expo-material3-theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, useTheme } from "react-native-paper";
import { ThemeSettingContext } from "./context";

const themeSetting = () => {
  // Lấy settings từ context
  const { themeMode, materialYou } = useContext(ThemeSettingContext);

  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme({ fallbackSourceColor: "#136875" });

  const themeDefault = createMaterial3Theme('#136875');


  // Xác định chế độ sáng/tối dựa trên lựa chọn người dùng
  const effectiveScheme = themeMode === "auto" ? colorScheme : themeMode; // "light" | "dark" | "auto"

  const paperTheme = useMemo(() => {
    if (materialYou) {
      return effectiveScheme === "dark"
        ? { ...MD3DarkTheme, colors: theme.dark }
        : { ...MD3LightTheme, colors: theme.light };
    } else {
      // Không dùng Material You, dùng màu fallback
      return effectiveScheme === "dark"
        ? { ...MD3DarkTheme, colors: themeDefault.dark }
        : { ...MD3LightTheme, colors: themeDefault.light };
    }
  }, [effectiveScheme, materialYou, theme]);

  return paperTheme;
};


export const ThemeSettingProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState("auto");
  const [materialYou, setMaterialYou] = useState(true);

  // Nạp theme đã lưu từ cài đặt hệ thống lên khi khởi động chương trình
  useEffect(() => {
    (async () => {
      const storedThemeMode = await AsyncStorage.getItem("theme_mode");
      const storedMaterialYou = await AsyncStorage.getItem("material_you");

      if (storedThemeMode) setThemeMode(storedThemeMode);
      if (storedMaterialYou !== null) setMaterialYou(storedMaterialYou === "true");
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("theme_mode", themeMode);
  }, [themeMode]);

  useEffect(() => {
    AsyncStorage.setItem("material_you", materialYou.toString());
  }, [materialYou]);

  return (
    <ThemeSettingContext.Provider value={{ themeMode, setThemeMode, materialYou, setMaterialYou }}>
      {children}
    </ThemeSettingContext.Provider>
  );
};

export default themeSetting;