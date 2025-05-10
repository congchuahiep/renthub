import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import StackNavigator from './StackNavigator';
import { BottomNavigation } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';
const Tab = createBottomTabNavigator();

export default function TabNavigator() {

	return (
		<Tab.Navigator
			screenOptions={{ headerShown: false }}
			tabBar={({ navigation, state, descriptors, insets }) => (
				<BottomNavigation.Bar
					navigationState={state}
					safeAreaInsets={insets}
					onTabPress={({ route, preventDefault }) => {
						const event = navigation.emit({
							type: 'tabPress',
							target: route.key,
							canPreventDefault: true,
						});

						if (event.defaultPrevented) {
							preventDefault();
						} else {
							navigation.dispatch({
								...CommonActions.navigate(route.name, route.params),
								target: state.key,
							});
						}
					}}
					renderIcon={({ route, focused, color }) =>
						descriptors[route.key].options.tabBarIcon?.({
							focused,
							color,
							size: 24,
						}) || null
					}
					getLabelText={({ route }) => {
						const { options } = descriptors[route.key];
						const label =
							typeof options.tabBarLabel === 'string'
								? options.tabBarLabel
								: typeof options.title === 'string'
									? options.title
									: route.name;

						return label;
					}}
				/>
			)}>
			<Tab.Screen name="explore" component={StackNavigator} options={{
				tabBarIcon: ({ color }) => (
					<MaterialDesignIcons name="home-search" color={color} size={26} />
				),
			}}
			/>
		</Tab.Navigator>
	);
}