import Navigator from './navigation';
import themeSetting from './config/theme';
import { PaperProvider } from 'react-native-paper';


export default function App() {

  const theme = themeSetting()

  return (
    <PaperProvider theme={theme} >
      <Navigator />
    </PaperProvider>
  );
}

