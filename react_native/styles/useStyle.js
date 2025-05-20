import { useContext } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { useTheme } from "react-native-paper";
import { ThemeSettingContext } from "../config/context";

const useStyle = () => {
  const { themeMode } = useContext(ThemeSettingContext);
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeMode == 'dark' ? theme.colors.surface : theme.colors.surfaceVariant, // Sử dụng màu từ theme
      paddingHorizontal: 16,
    },
    appBar: {
      backgroundColor: themeMode == 'dark' ? theme.colors.elevation.level1 : theme.colors.surface,
    },
    bottomBar: {
      backgroundColor: themeMode == 'dark' ? theme.colors.elevation.level1 : theme.colors.surface,
      height: 90
    },
    card: {
      marginVertical: 8,
      backgroundColor: themeMode == 'dark' ? theme.colors.elevation.level1 : theme.colors.surface, // Sử dụng màu từ theme
      borderRadius: 8,
      boxShadow: "0px 3px rgba(136, 136, 136, 0.5)",
      borderWidth: themeMode == 'dark' ? 0 : 1,
      borderColor: theme.colors.secondary
    },
    box_shadow: {
      boxShadow: "0px 3px rgba(136, 136, 136, 0.5)"
    },
    title_small: {
      fontSize: 18,
      fontWeight: 700,
      marginTop: 6,
      color: theme.colors.onPrimaryContainer
    },
    title_big: {
      fontSize: 24,
      fontWeight: 900,
      marginTop: 8,
      color: theme.colors.onPrimaryContainer
    },
    input: {
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.primary,
      borderWidth: 1,
    }
  });
};

export default useStyle;