import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, StatusBar } from 'react-native';

import colors from '@utils/colors';
import Verification from '@views/auth/Verification';

const App = () => {
  return (
    <>
      <StatusBar backgroundColor={colors.PRIMARY} barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        {/* <SignUp /> */}
        {/* <SignIn /> */}
        {/* <LostPassword /> */}
        <Verification />
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
