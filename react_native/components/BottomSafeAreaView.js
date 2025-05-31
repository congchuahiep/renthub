import {useSafeAreaInsets} from "react-native-safe-area-context";
import {View} from "react-native";

const BottomSafeAreaView = ({children, style}) => {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                style,
                {
                    flex: 1,
                    paddingBottom: insets.bottom
                }
            ]}
        >
            {children}
        </View>
    );
}

export default BottomSafeAreaView;