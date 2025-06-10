import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "./config/auth";
import themeSetting, { ThemeSettingProvider } from "./config/theme";
import Navigator from "./navigation";
import { SnackbarProvider } from "./config/snackbar";

export default function App() {
	return (
		<AuthProvider>
			<ThemeSettingProvider>
				<ThemeWithPaper>
					<SnackbarProvider>
						<Navigator />
					</SnackbarProvider>
				</ThemeWithPaper>
			</ThemeSettingProvider>
		</AuthProvider>
	);
}

// Component này để lấy theme sau khi context đã sẵn sàng
function ThemeWithPaper({ children }) {
	const theme = themeSetting();

	return <PaperProvider theme={theme}>{children}</PaperProvider>;
}
