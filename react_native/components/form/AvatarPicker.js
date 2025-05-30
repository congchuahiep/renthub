import { View, Image, StyleSheet } from "react-native";
import { Button, IconButton } from "react-native-paper";

const AvatarPicker = ({ avatar, onPick, onRemove }) => (
  <View style={styles.container}>
    <View style={styles.avatarWrapper}>
      <Image
        source={
          avatar && avatar.uri
            ? { uri: avatar.uri }
            : require("../../assets/no-avatar.jpg")
        }
        style={styles.avatar}
        resizeMode="cover"
      />
      {avatar && avatar.uri && (
        <IconButton
          icon="close"
          size={22}
          style={styles.removeBtn}
          onPress={onRemove}
          accessibilityLabel="Xoá ảnh đại diện"
        />
      )}
      <Button
        mode="contained"
        icon="camera"
        onPress={onPick}
        style={styles.button}
        labelStyle={{ fontSize: 14 }}
        compact
      >
        Chọn ảnh đại diện
      </Button>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 16,
  },
  avatarWrapper: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: "#ccc",
    backgroundColor: "#f2f2f2",
    marginBottom: 8,
  },
  button: {
    borderRadius: 20,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  removeBtn: {
    position: "absolute",
    top: -16,
    right: 16,
    backgroundColor: "#fff",
    zIndex: 2,
  },
});

export default AvatarPicker;