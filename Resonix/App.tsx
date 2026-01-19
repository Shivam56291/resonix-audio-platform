import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, StatusBar } from 'react-native';

import SignUp from '@views/auth/SignUp';
import colors from '@utils/colors';

const App = () => {
  return (
    <>
      <StatusBar backgroundColor={colors.PRIMARY} barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <SignUp />
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
