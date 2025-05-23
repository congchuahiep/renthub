import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import PostAppbar from '../components/PostAppbar';
import RentalDetail from '../screens/RentalDetail';
import TabNavigator from './TabNavigator';
import Setting from '../screens/Setting';
import AppbarDefault from '../components/Appbar';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.surfaceVariant
        }
      }}
    >
      <Stack.Screen
        name="home"
        component={TabNavigator}
      />
      <Stack.Screen
        name="rentalDetail"
        component={RentalDetail}
        options={({ route }) => ({
          title: route.params.title ? route.params.title : "Bài đăng cho thuê trọ",
          headerShown: true,
          header: (props) => <PostAppbar {...props} />,
        })}
      />
      {/* <Stack.Screen/> */}
      <Stack.Screen
        name="settings"
        component={Setting}
        options={({ route }) => ({
          title: "Cài đặt",
          headerShown: true,
          header: (props) => <AppbarDefault {...props} />
        })}
      />
    </Stack.Navigator>
  );
}
