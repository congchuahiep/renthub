import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import Profile from '../screens/Profile';
import BottomBar from '../components/BottomBar';
import RentalList from '../screens/RentalList';
import PostAppbar from '../components/PostAppbar';

const Tab = createBottomTabNavigator();


export default function TabNavigator() {

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
				name="profile"
				component={Profile}
				options={{
					title: "Người dùng",
					tabBarIcon: ({ color }) => (
						<MaterialDesignIcons name="account" color={color} size={26} />
					),
				}}
			/>
		</Tab.Navigator>
	);
}