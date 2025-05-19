import { useState } from 'react';
import { Appbar, Menu, Searchbar } from 'react-native-paper';
import { getHeaderTitle } from '@react-navigation/elements';
import { useTheme } from 'react-native-paper';
import card from '../styles/card';


export default function PostAppbar({
  navigation,
  route,
  options,
  back,
}) {
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(true);
  const theme = useTheme();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const title = getHeaderTitle(options, route.name);

  return (
    <Appbar.Header mode='center-aligned'>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : <Appbar.Action onPress={() => console.log("Hôm nay bạn đẹp trai lắm ^^: " + process.env.EXPO_PUBLIC_DJANGO_SERVER_URL)} />}

      {
        !back ? (
          <>
            <Searchbar
              placeholder="Tìm kiếm..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={[
                card.box_shadow,
                {
                  flex: 1,
                  height: 42,
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.primary,
                  borderWidth: 1,
                }
              ]}
              inputStyle={{ minHeight: 42, height: 42 }}
            />

            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <Appbar.Action
                  icon="dots-vertical"
                  onPress={openMenu}
                />
              }>
              <Menu.Item
                onPress={() => {
                  console.log('Option 1 was pressed');
                }}
                title="Option 1"
              />
              <Menu.Item
                onPress={() => {
                  console.log('Option 2 was pressed');
                }}
                title="Option 2"
              />
              <Menu.Item
                onPress={() => {
                  console.log('Option 3 was pressed');
                }}
                title="Option 3"
                disabled
              />
            </Menu>
          </>
        ) : (
          <Appbar.Content title={title} />
        )
      }

    </Appbar.Header >
  );
}