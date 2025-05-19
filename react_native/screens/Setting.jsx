import React, { useContext, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { List, Switch, RadioButton, Text, useTheme, TextInput } from "react-native-paper";
import useStyle from "../styles/useStyle";
import { ThemeSettingContext } from "../config/context";
import { Dropdown } from "react-native-paper-dropdown";

const Setting = () => {
  const theme = useTheme();
  const style = useStyle();
  const { themeMode, materialYou, setThemeMode, setMaterialYou } = useContext(ThemeSettingContext);

  const [showDropDown, setShowDropDown] = useState(false);


  const displayModes = [
    { label: "Tự động", value: "auto" },
    { label: "Sáng", value: "light" },
    { label: "Tối", value: "dark" },
  ];

  const onToggleMaterialYou = () => {
    setMaterialYou(!materialYou);
  };

  const onChangeThemeMode = (value) => {
    setThemeMode(value);
  };

  return (
    <View style={[style.container, { flex: 1 }]}>
      <List.Section style={{ marginHorizontal: 12 }}>
        <List.Subheader>Cài đặt hiển thị</List.Subheader>
        <List.Item
          left={() => <List.Icon color={theme.colors.secondary} icon={"palette"} />}
          title="Tự động màu sắc theo hệ thống "
          titleNumberOfLines={2}
          style={{ paddingRight: 0 }}
          description={() => <Text>(Material You)</Text>}
          right={() => (
            <Switch value={materialYou} onValueChange={onToggleMaterialYou} />
          )}
        />
        <List.Item
          title="Chế độ hiển thị"
          left={() => <List.Icon color={theme.colors.secondary} icon={"theme-light-dark"} />}
          style={{ paddingRight: 0 }}
          right={() => (
            <Dropdown
              hideMenuHeader={true}
              mode="outlined"
              options={displayModes}
              value={themeMode}
              onSelect={onChangeThemeMode}
            />
          )}
        />
      </List.Section>
    </View>
  );
};

export default Setting;