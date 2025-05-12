import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RentalList from '../screens/RentalList';
import PostAppbar from '../components/PostAppbar';
import RentalDetail from '../screens/RentalDetail';
import { useTheme } from 'react-native-paper';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <PostAppbar {...props} />,
        contentStyle: {
          backgroundColor: theme.colors.surfaceVariant
        }
      }}
    >
      <Stack.Screen
        name="rentalList"
        component={RentalList}
      />
      <Stack.Screen
        name="rentalDetail"
        component={RentalDetail}
        options={({ route }) => ({
          title: route.params.title ? route.params.title : "Bài đăng cho thuê trọ"
        })} />
    </Stack.Navigator>
  );
}
