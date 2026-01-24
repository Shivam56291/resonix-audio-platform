import { StatusBar } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AnimatedSplash from 'src/ui/AnimatedSplash';

import colors from '@utils/colors';
import store from 'src/store';
import AppNavigator from 'src/navigation';
import AppContainer from 'src/components/AppContainer';

const App = () => {
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    BootSplash.hide({ fade: true });
  }, []);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <StatusBar backgroundColor={colors.PRIMARY} barStyle="light-content" />
        {splashVisible ? (
          <AnimatedSplash
            onFinish={() => setSplashVisible(false)}
            logo={require('./assets/logo.png')}
            tagline="Turn moments into sound."
            backgroundColor="#121212"
          />
        ) : (
          <AppContainer>
            <AppNavigator />
          </AppContainer>
        )}
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
