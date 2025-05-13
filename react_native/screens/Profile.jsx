import { View } from "react-native"
import { Text, useTheme } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context";
import useStyle from "../styles/useStyle";

const Profile = () => {
  const theme = useTheme();
  const style = useStyle();

  return (
    <SafeAreaView style={style.container}>
      <Text>
        Hello
      </Text>
    </SafeAreaView>
  )
}

export default Profile;