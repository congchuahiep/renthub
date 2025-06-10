import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BottomBar from "../components/BottomBar";
import RentalAppbar from "../components/RentalAppbar";
import { useAuth } from "../config/auth";
import ChatsList from "../screens/Chats";
import Login from "../screens/Login";
import Profile from "../screens/Profile";
import PropertyList from "../screens/PropertyList";
import RentalList from "../screens/RentalList";
import RoomSeekingList from "../screens/RoomSeekingList";
import Users from "../screens/Users";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
	const { user } = useAuth();
	console.log("Current user:", user);

	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: false,
			}}
			tabBar={(props) => <BottomBar {...props} />}
		>
			<Tab.Screen
				name="explore"
				component={RentalList}
				options={{
					title: "Khám phá",
					headerShown: true,
					headerTransparent: true,
					header: (props) => <RentalAppbar {...props} />,
					tabBarIcon: ({ color }) => (
						<MaterialDesignIcons name="home-search" color={color} size={26} />
					),
				}}
			/>
			<Tab.Screen
				name="roomseekings"
				component={RoomSeekingList}
				options={{
					title: "Tìm trọ",
					headerShown: true,
					tabBarIcon: ({ color }) => (
						<MaterialDesignIcons name="bullhorn" color={color} size={26} />
					),
				}}
			/>
			<Tab.Screen
				name="propertylist"
				component={PropertyList}
				options={{
					title: "Dãy trọ",
					headerShown: true,
					tabBarIcon: ({ color }) => (
						<MaterialDesignIcons name="home-group" color={color} size={26} />
					),
				}}
			/>
			{user !== null ? (
				<>
					<Tab.Screen
						name="user"
						component={Users}
						options={{
							title: "Tìm đối tác",
							tabBarIcon: ({ color }) => (
								<MaterialDesignIcons
									name="account-group"
									color={color}
									size={26}
								/>
							),
						}}
					/>

					<Tab.Screen
						name="Chats"
						component={ChatsList}
						options={{
							title: "Tin nhắn",
							tabBarIcon: ({ color }) => (
								<MaterialDesignIcons name="chat" color={color} size={26} />
							),
						}} />
					<Tab.Screen
						name="profile"
						component={Profile}
						options={{
							title: "Người dùng",
							tabBarIcon: ({ color }) => (
								<MaterialDesignIcons name="account" color={color} size={26} />
							),
						}}
					/>
				</>
			) : (
				<>
					<Tab.Screen
						name="Login"
						component={Login}
						options={{
							title: "Đăng nhập",
							tabBarIcon: ({ color }) => (
								<MaterialDesignIcons name="login" color={color} size={26} />
							),
						}}
					/>
				</>
			)}
		</Tab.Navigator>
	);
}
