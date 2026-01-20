import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, StatusBar } from 'react-native';

import colors from '@utils/colors';
import AuthNavigator from 'navigation/AuthNavigator';

const App = () => {
  return (
    <>
      <StatusBar backgroundColor={colors.PRIMARY} barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <AuthNavigator />
        </NavigationContainer>
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
