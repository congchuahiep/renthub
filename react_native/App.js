import { useReducer } from 'react';
import { PaperProvider } from 'react-native-paper';
import { MyDispatchContext, UserContext } from './config/context';
import themeSetting, { ThemeSettingProvider } from './config/theme';
import Navigator from './navigation';
import MyUserReducer from './reducers/MyUserReducer';


export default function App() {
  const [user, dispatch] = useReducer(MyUserReducer, null)

  return (
    <ThemeSettingProvider>
      <UserContext.Provider value={user}>
        <MyDispatchContext.Provider value={dispatch}>
          <ThemeWithPaper >
            <Navigator />
          </ThemeWithPaper>
        </MyDispatchContext.Provider>
      </UserContext.Provider>
    </ThemeSettingProvider>
  );
}


// Tạo component này để lấy theme sau khi context đã sẵn sàng
function ThemeWithPaper({ children }) {
  const theme = themeSetting();
  
  return <PaperProvider theme={theme}>{children}</PaperProvider>;
}