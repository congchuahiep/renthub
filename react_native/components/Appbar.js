import { getHeaderTitle } from "@react-navigation/elements";
import { Appbar } from "react-native-paper";

export default function AppbarDefault({
  navigation,
  route,
  options,
  back,
}) {

  const title = getHeaderTitle(options, route.name);

  return (
    <Appbar.Header mode='center-aligned'>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : <Appbar.Action onPress={() => console.log("Hôm nay bạn đẹp trai lắm ^^: " + process.env.EXPO_PUBLIC_DJANGO_SERVER_URL)} />}
      
      <Appbar.Content title={title} />
    </Appbar.Header>
  )
}