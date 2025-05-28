import {useSafeAreaInsets} from "react-native-safe-area-context";
import {View} from "react-native";

const TopSafeAreaView = ({children, style}) => {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                style,
                {
                    flex: 1,
                    paddingTop: insets.top,
                }
            ]}
        >
            {children}
        </View>
    );
}

export default TopSafeAreaView;