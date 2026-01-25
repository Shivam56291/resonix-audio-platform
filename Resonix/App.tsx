import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';

import colors from '@utils/colors';
import store from 'src/store';
import AppNavigator from 'src/navigation';
import AppContainer from 'src/components/AppContainer';

const queryClient = new QueryClient();

const App = () => {

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <StatusBar backgroundColor={colors.PRIMARY} barStyle="light-content" />
          <QueryClientProvider client={queryClient}>
            <AppContainer>
              <AppNavigator />
            </AppContainer>
          </QueryClientProvider>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
