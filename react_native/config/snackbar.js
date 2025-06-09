import { useContext, useState } from "react";
import { Portal, Snackbar } from "react-native-paper";
import { SnackbarContext } from "./context";

export function SnackbarProvider({ children }) {
	const [visible, setVisible] = useState(false);
	const [duration, setDuration] = useState(false);
	const [message, setMessage] = useState("");

	const showSnackbar = (msg, duration = 5000) => {
		setMessage(msg);
		setDuration(duration);
		setVisible(true);
	};

	return (
		<SnackbarContext.Provider value={showSnackbar}>
			{children}
			<Portal>
				<Snackbar
					visible={visible}
					onDismiss={() => setVisible(false)}
					duration={duration}
					onIconPress={() => setVisible(false)}
					style={{ marginBottom: 90 }}
				>
					{message}
				</Snackbar>
			</Portal>
		</SnackbarContext.Provider>
	);
}

export function useSnackbar() {
	return useContext(SnackbarContext);
}
