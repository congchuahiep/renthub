import { useColorScheme } from 'react-native';
import Navigator from './navigation';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { useEffect, useMemo } from 'react';
import { DJANGO_SERVER_URL } from "@env"

export default function App() {

  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme({ fallbackSourceColor: "#0e7490" }); // Sử dụng MD3 theme

  // Thay đổi sáng tối
  const paperTheme = useMemo(() => {
    return colorScheme === 'dark'
      ? { ...MD3DarkTheme, colors: theme.dark }
      : { ...MD3LightTheme, colors: theme.light };
  }, [colorScheme, theme]);

  // This useEffect used for debug
  useEffect(() => {
    console.log(DJANGO_SERVER_URL)
  }, [])

  return (
    <PaperProvider theme={paperTheme}>
      <Navigator />
    </PaperProvider>
  );
}
