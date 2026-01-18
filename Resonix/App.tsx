import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

import SignUp from '@views/auth/SignUp';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <SignUp />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
