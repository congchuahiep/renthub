import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { useMemo } from "react";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, useTheme } from "react-native-paper";

const themeSetting = () => {

    const colorScheme = useColorScheme();
    const { theme } = useMaterial3Theme({ fallbackSourceColor: "#136875" }); // Sử dụng MD3 theme
  
    // Thay đổi sáng tối
    const paperTheme = useMemo(() => {
      return colorScheme === 'dark'
        ? { ...MD3DarkTheme, colors: theme.dark }
        : { ...MD3LightTheme, colors: {...theme.light} };
    }, [colorScheme, theme]);

  return paperTheme;
}

export default themeSetting;