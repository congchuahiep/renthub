import { CommonActions, getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { BottomNavigation } from "react-native-paper";
import { useTheme } from "react-native-paper";

/**
 * Thanh hiển thị dưới màn hình của ứng dụng
 */
const BottomBar = ({ navigation, state, descriptors, insets }) => {
  const theme = useTheme();

  // Lấy tên màn hình hiện tại
  const currentRouteName = getFocusedRouteNameFromRoute(state.routes[state.index]) ?? '';

  // Ẩn thanh BottomBar nếu đang ở các màn hình sau:
  if (currentRouteName === 'rentalDetail') {
    return null;
  }

  return (
    <BottomNavigation.Bar
      style={{ height: 85, backgroundColor: theme.colors.surface }}
      compact={true}
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
  )
}

export default BottomBar;