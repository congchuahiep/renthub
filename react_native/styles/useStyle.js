import { StyleSheet, useColorScheme } from "react-native";
import { useTheme } from "react-native-paper";

const useStyle = () => {
  const colorScheme = useColorScheme();
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surfaceVariant, // Sử dụng màu từ theme
      paddingHorizontal: 16,
    },
    card: {
      marginVertical: 8,
      backgroundColor: theme.colors.surface, // Sử dụng màu từ theme
      borderRadius: 8,
      boxShadow: "0px 3px rgba(136, 136, 136, 0.5)",
      borderWidth: colorScheme == 'dark' ? 0 : 1,
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