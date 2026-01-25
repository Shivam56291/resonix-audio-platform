import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import AnimatedSplash from '@ui/AnimatedSplash';
import BootSplash from 'react-native-bootsplash';

import { getAuthState } from 'src/store/auth';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import { getFromAsyncStorage, Keys } from 'utils/asyncStorage';
import client from 'src/api/client';
import { updateLoggedInState, updateProfile } from 'store/auth';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { loggedIn } = useSelector(getAuthState);
  const dispatch = useDispatch();
  const [splashDone, setSplashDone] = useState(false);

  const checkAuth = async () => {
    try {
      const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
      if (!token) return;

      const { data } = await client.get('/auth/is-auth', {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(updateProfile(data.profile));
      dispatch(updateLoggedInState(true));
    } catch (err) {
      console.log('Auth error', err);
    }
  };

    useEffect(() => {
    BootSplash.hide({ fade: false }); // 👈 immediately
    }, []);
  
  if (!splashDone) {
    return (
      <AnimatedSplash
        onFinish={async () => {
          await Promise.all([
            checkAuth(),
            new Promise<void>(resolve => setTimeout(resolve, 1200)),
          ]);

          setSplashDone(true);
        }}
        logo={require('../../assets/logo.png')}
        tagline="Turn moments into sound."
        backgroundColor="#121212"
      />
    );
  }

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
