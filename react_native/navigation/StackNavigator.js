import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import AppbarDefault from '../components/Appbar';
import PostAppbar from '../components/PostAppbar';
import FollowerList from '../screens/FollowList';
import ProfileUser from '../screens/ProfileUser';
import RentalDetail from '../screens/RentalDetail';
import Setting from '../screens/Setting';
import UserInfo from '../screens/UserInfo';
import TabNavigator from './TabNavigator';

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
      <Stack.Screen
        name="UserInfo"
        component={UserInfo}
        options={({ route }) => ({
          headerShown: true,
          title: route.params.title ? route.params.title : "Thông tin cá nhân",
          header:(props)=><AppbarDefault{...props}/>
        })}
      />
      <Stack.Screen
        name="FollowerList"
        component={FollowerList}
        options={{
          title: "Danh sách người theo dõi",
          headerShown: true,
          header: (props) => <PostAppbar {...props} />

        }}
      />
      <Stack.Screen
        name="ProfileUser"
        component={ProfileUser}
        options={{
          title: "Thông tin người dùng",
          headerShown: true,
          header:(props)=><AppbarDefault{...props}/>
        }}
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
