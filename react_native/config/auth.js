import { useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Apis, { authApis, endpoints } from "../config/Apis";
import { AuthContext } from "./context";

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [userLoading, setUserLoading] = useState(true);

	// Khôi phục session khi mở app
	useEffect(() => {
		loadStoredAuth();
	}, []);

	const loadStoredAuth = async () => {
		try {
			const token = await AsyncStorage.getItem("token");
			if (token) {
				const response = await authApis(token).get(endpoints.currentUser);
				setUser(response.data)
			}
		} catch (error) {
			await AsyncStorage.removeItem("token");
		} finally {
			setUserLoading(false);
		}
	};

	/**
	 * Xử lý đăng nhập bằng username và password
	 */
	const login = async (username, password) => {
		const requestData = {
			username,
			password,
			client_id: process.env.EXPO_PUBLIC_AUTH_CLIENT_ID,
			client_secret: process.env.EXPO_PUBLIC_AUTH_CLIENT_SECRET,
			grant_type: "password",
		};

		const response = await Apis.post(endpoints.login, requestData, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		const token = response.data.access_token;
		await AsyncStorage.setItem("token", token);
		const userResponse = await authApis(token).get(endpoints.currentUser);

		setUser({ ...userResponse.data, token });
		return userResponse.data;
	};

	/**
	 * Xử lý đăng xuất
	 */
	const logout = async () => {
		await AsyncStorage.removeItem("token");
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				userLoading,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
