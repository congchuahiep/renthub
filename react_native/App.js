import { useReducer } from 'react';
import { PaperProvider } from 'react-native-paper';
import { MyDispatchContext, MyUserContext } from './config/context';
import themeSetting from './config/theme';
import Navigator from './navigation';
import MyUserReducer from './reducers/MyUserReducer';


export default function App() {
  const [user, dispatch] = useReducer(MyUserReducer, null)
  const theme = themeSetting()

  return (
    <MyUserContext.Provider value={user}>
      <MyDispatchContext.Provider value={dispatch}>
        <PaperProvider theme={theme} >
          <Navigator />
        </PaperProvider>
      </MyDispatchContext.Provider>
    </MyUserContext.Provider>

  );
}

