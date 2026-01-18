import { Text } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Text>Hello World</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
