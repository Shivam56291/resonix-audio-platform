import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';

import colors from '@utils/colors';
import store from 'src/store';
import AppNavigator from 'src/navigation';
import AppContainer from 'src/components/AppContainer';

const App = () => {
  return (
    <>
      <StatusBar backgroundColor={colors.PRIMARY} barStyle="light-content" />
      <AppContainer>
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </AppContainer>
    </>
  );
};

export default App;
