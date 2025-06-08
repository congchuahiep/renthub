import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { useTheme } from "react-native-paper";
import AppbarDefault from "../components/Appbar";
import RentalAppbar from "../components/RentalAppbar";
import { ThemeSettingContext } from "../config/context";
import FollowerList from "../screens/FollowList";
import ProfileUser from "../screens/ProfileUser";
import Register from "../screens/Register";
import RegisterLandlord from "../screens/RegisterLandlord";
import RegisterTenant from "../screens/RegisterTenant";
import RentalDetail from "../screens/RentalDetail";
import RoomSeekingDetail from "../screens/RoomSeekingDetail";
import Setting from "../screens/Setting";
import ProfileDetail from "../screens/ProfileDetail";
import RegionAddressSelect from "../screens/address/RegionAddressSelect";
import TabNavigator from "./TabNavigator";
import StreetAddressSelect from "../screens/address/StreetAddressSelect";
import RentalCreate from "../screens/RentalCreate";
import PropertySellect from "../screens/property/PropertySelect";
import RentalMapping from "../screens/RentalMapping";
import RentalMapAppbar from "../components/RentalMapAppbar";
import PropertyCreate from "../screens/PropertyCreate";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
	const { themeMode } = useContext(ThemeSettingContext);
	const theme = useTheme();

	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
				contentStyle: {
					backgroundColor:
						themeMode === "dark"
							? theme.colors.elevation.level5
							: theme.colors.elevation.level1,
				},
			}}
		>
			<Stack.Screen name="Home" component={TabNavigator} />
			<Stack.Screen
				name="RentalDetail"
				component={RentalDetail}
				options={({ route }) => ({
					title: route.params.title
						? route.params.title
						: "Bài đăng cho thuê trọ",
					headerShown: true,
					header: (props) => <RentalAppbar {...props} />,
				})}
			/>
			<Stack.Screen
				name="RoomSeekingDetail"
				component={RoomSeekingDetail}
				options={({ route }) => ({
					title: route.params.title ? route.params.title : "Bài đăng tìm trọ",
					headerShown: true,
					header: (props) => <AppbarDefault {...props} />,
				})}
			/>

			<Stack.Screen
				name="ProfileDetail"
				component={ProfileDetail}
				options={({ route }) => ({
					headerShown: true,
					title: route.params.title ? route.params.title : "Thông tin cá nhân",
					header: (props) => <AppbarDefault {...props} />,
				})}
			/>
			<Stack.Screen
				name="FollowerList"
				component={FollowerList}
				options={{
					title: "Danh sách người theo dõi",
					headerShown: true,
					header: (props) => <RentalAppbar {...props} />,
				}}
			/>
			<Stack.Screen
				name="ProfileUser"
				component={ProfileUser}
				options={{
					title: "Thông tin người dùng",
					headerShown: true,
					header: (props) => <AppbarDefault {...props} />,
				}}
			/>
			{/* <Stack.Screen/> */}
			<Stack.Screen
				name="Settings"
				component={Setting}
				options={({ route }) => ({
					title: "Cài đặt",
					headerShown: true,
					header: (props) => <AppbarDefault {...props} />,
				})}
			/>
			<Stack.Screen name="Register" component={Register} />
			<Stack.Screen
				name="RegisterTenant"
				component={RegisterTenant}
				options={({ route }) => ({
					title: "Đăng ký tài khoản tìm trọ",
					headerShown: true,
					headerTransparent: false,
					header: (props) => <AppbarDefault {...props} />,
				})}
			/>
			<Stack.Screen
				name="RegisterLandlord"
				component={RegisterLandlord}
				options={({ route }) => ({
					title: "Đăng ký tài khoản chủ trọ",
					headerShown: true,
					headerTransparent: false,
					header: (props) => <AppbarDefault {...props} />,
				})}
			/>
			<Stack.Screen
				name="RegionAddressSelect"
				component={RegionAddressSelect}
				options={({ route }) => ({
					title: "Chọn tỉnh/huyện/xã",
					headerShown: true,
					headerTransparent: false,
					header: (props) => <AppbarDefault {...props} />,
				})}
			/>
			<Stack.Screen
				name="StreetAddressSelect"
				component={StreetAddressSelect}
				options={({ route }) => ({
					title: "Chọn số nhà, vị trí cụ thể",
					headerShown: true,
					headerTransparent: false,
					header: (props) => <AppbarDefault {...props} />,
				})}
			/>
			<Stack.Screen
				name="RentalCreate"
				component={RentalCreate}
				options={({ route }) => ({
					title: "Đăng bài cho thuê",
					headerShown: true,
					headerTransparent: false,
					header: (props) => <AppbarDefault {...props} />,
				})}
			/>
			<Stack.Screen
				name="RentalMapping"
				component={RentalMapping}
				options={({ route }) => ({
					title: "Tìm kiếm dãy trọ",
					headerShown: true,
					headerTransparent: true,
					header: (props) => <RentalMapAppbar {...props} />,
				})}
			/>
			<Stack.Screen
				name="PropertySelect"
				component={PropertySellect}
				options={({ route }) => ({
					title: "Chọn dãy trọ",
					headerShown: true,
					headerTransparent: false,
					header: (props) => <AppbarDefault {...props} />,
				})}
			/>
			<Stack.Screen
				name="PropertyCreate"
				component={PropertyCreate}
				options={({ route }) => ({
					title: "Đăng ký dãy trọ mới",
					headerShown: true,
					headerTransparent: false,
					header: (props) => <AppbarDefault {...props} />,
				})}
			/>
		</Stack.Navigator>
	);
}
