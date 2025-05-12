import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import StackNavigator from './StackNavigator';
import Profile from '../screens/Profile';
import BottomBar from '../components/BottomBar';

const Tab = createBottomTabNavigator();


export default function TabNavigator() {

	return (
		<Tab.Navigator
			screenOptions={{ headerShown: false }}
			tabBar={(props) => <BottomBar {...props} />}
		>
			<Tab.Screen
				name="explore"
				component={StackNavigator}
				options={{
					tabBarIcon: ({ color }) => (
						<MaterialDesignIcons name="home-search" color={color} size={26} />
					),
				}}
			/>
			<Tab.Screen
				name="profile"
				component={Profile}
				options={{
					tabBarIcon: ({ color }) => (
						<MaterialDesignIcons name="account" color={color} size={26} />
					),
				}} />
		</Tab.Navigator>
	);
}