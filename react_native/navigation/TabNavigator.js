import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useContext } from 'react';
import BottomBar from '../components/BottomBar';
import PostAppbar from '../components/PostAppbar';
import { UserContext } from '../config/context';
import ChatListScreen from '../screens/Chats';
import Login from '../screens/Login';
import Profile from '../screens/Profile';
import PropertyList from '../screens/PropertyList';
import Register from '../screens/RegisterTenant';
import RentalList from '../screens/RentalList';
import RoomSeekingList from '../screens/RoomSeekingList';
import Users from '../screens/Users';

const Tab = createBottomTabNavigator();


export default function TabNavigator() {
	const user = useContext(UserContext)
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
					header: (props) => <PostAppbar {...props} />,
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
					header: (props) => <PostAppbar {...props} />,
					tabBarIcon: ({ color }) => (
						<MaterialDesignIcons name="home-outline" color={color} size={26} />
					),
				}}
			/>
			<Tab.Screen
				name="propertylist"
				component={PropertyList}
				options={{
					title: "Dãy trọ",
					headerShown: true,
					header: (props) => <PostAppbar {...props} />,
					tabBarIcon: ({ color }) => (
						<MaterialDesignIcons name="home-group" color={color} size={26} />
					),
				}} />
			{user !== null ?
				<>
					<Tab.Screen
						name="user"
						component={Users}
						options={{
							title: "Tìm đối tác",
							tabBarIcon: ({ color }) => (
								<MaterialDesignIcons name="account-group" color={color} size={26} />
							),
						}} />

					<Tab.Screen
						name="chats"
						component={ChatListScreen}
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

				</> : <>

					<Tab.Screen
						name="login"
						component={Login}
						options={{
							title: "Đăng nhập",
							tabBarIcon: ({ color }) => (
								<MaterialDesignIcons name="login" color={color} size={26} />
							),
						}}
					/>
				</>}
		</Tab.Navigator>
	);
}