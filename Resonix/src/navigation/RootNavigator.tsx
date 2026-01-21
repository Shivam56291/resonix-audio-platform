import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import { getAuthState } from 'src/store/auth';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { loggedIn } = useSelector(getAuthState);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!loggedIn ? (
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{ animation: 'slide_from_right' }}
        />
      ) : (
        <Stack.Screen
          name="App"
          component={TabNavigator}
          options={{ animation: 'fade' }}
        />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
