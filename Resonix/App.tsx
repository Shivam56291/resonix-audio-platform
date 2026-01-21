import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, StatusBar } from 'react-native';
import { Provider } from 'react-redux';

import colors from '@utils/colors';
import store from 'src/store';
import AppNavigator from 'src/navigation';

const App = () => {
  return (
    <>
      <StatusBar backgroundColor={colors.PRIMARY} barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
    color: colors.CONTRAST,
  },
});

export default App;
