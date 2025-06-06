import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import BottomBar from '../components/BottomBar';
import ChatListScreen from '../screens/Chats';
import Login from '../screens/Login';
import RoomSeekingForm from '../screens/MyPost';
import Profile from '../screens/Profile';
import PropertyList from '../screens/PropertyList';
import RentalList from '../screens/RentalList';
import RoomSeekingList from '../screens/RoomSeekingList';
import Users from '../screens/Users';
import {useAuth} from "../config/auth";
import RentalAppbar from "../components/RentalAppbar";
import Register from "../screens/RegisterTenant";


const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const {user} = useAuth();

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
          tabBarIcon: ({color}) => (
            <MaterialDesignIcons name="home-search" color={color} size={26}/>
          ),
        }}
      />
      <Tab.Screen
        name="roomseekings"
        component={RoomSeekingList}
      />
      <Tab.Screen
        name="propertylist"
        component={PropertyList}
      />
      {user !== null ?
        <>
          <Tab.Screen
            name="user"
            component={Users}
            options={{
              title: "Tìm đối tác",
              tabBarIcon: ({color}) => (
                <MaterialDesignIcons
                  name="account-group"
                  color={color}
                  size={26}
                />
              ),
            }}
          />

          {/* <Tab.Screen
            name="chats"
            component={ChatListScreen}
            options={{
              title: "Tin nhắn",
              tabBarIcon: ({color}) => (
                <MaterialDesignIcons name="chat" color={color} size={26}/>
              ),
						}} /> */}
          <Tab.Screen
            name="profile"
            component={Profile}
            options={{
              title: "Người dùng",
              tabBarIcon: ({color}) => (
                <MaterialDesignIcons name="account" color={color} size={26}/>
              ),
            }}
          />
          <Tab.Screen
            name="Đăng bài"
            component={RoomSeekingForm}
            options={{
              title: "Đăng bài",
              tabBarIcon: ({color}) => (
                <MaterialDesignIcons name="post" color={color} size={26}/>
              ),
            }}/>

        </> : (
          <>
            <Tab.Screen
              name="Login"
              component={Login}
              options={{
                title: "Đăng nhập",
                tabBarIcon: ({color}) => (
                  <MaterialDesignIcons name="login" color={color} size={26}/>
                ),
              }}
            />
          </>
        )}
    </Tab.Navigator>
  );
}
