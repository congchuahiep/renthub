import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useContext } from 'react';
import BottomBar from '../components/BottomBar';
import PostAppbar from '../components/PostAppbar';
import { MyUserContext } from '../config/context';
import ChatListScreen from '../screens/Chats';
import Login from '../screens/Login';
import Profile from '../screens/Profile';
import PropertyList from '../screens/PropertyList';
import RentalList from '../screens/RentalList';
import UserInfo from '../screens/UserInfo';

const Tab = createBottomTabNavigator();


export default function TabNavigator() {
	const user = useContext(MyUserContext)
	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: false,
			}}
			tabBar={(props) => <BottomBar {...props} />}
		>
			{user !== null ? <>

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
				<Tab.Screen
				name="user"
				component={UserInfo}
				options={{
					title:"Người dùng",
					tabBarIcon:({color})=>(
						<MaterialDesignIcons name="users" color={color} size={26}/>
					),
				}}/>
				<Tab.Screen
				name="propertylist"
				component={PropertyList}
				options={{
					title:"Dãy trọ",
					tabBarIcon:({color})=>(
						<MaterialDesignIcons name="proprerty" color={color} size={26}/>
					),
				}}/>
				<Tab.Screen
				name="chats"
				component={ChatListScreen}
				options={{
					title:"Tin nhắn",
					tabBarIcon:({color})=>(
						<MaterialDesignIcons name="chat" color={color} size={26}/>
					),
				}}/>
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


		</Tab.Navigator>
	);
}