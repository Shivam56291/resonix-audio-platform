import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';

import { getAuthState } from 'src/store/auth';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import { useEffect } from 'react';
import { getFromAsyncStorage, Keys } from 'utils/asyncStorage';
import client from 'src/api/client';
import {
  updateLoggedInState,
  updateProfile,
  updateBusyState,
} from 'store/auth';
import Loader from '@ui/Loader';
import colors from '@utils/colors';
import { View, StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { loggedIn, busy } = useSelector(getAuthState);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAuthInfo = async () => {
      dispatch(updateBusyState(true));
      try {
        const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
        if (!token) {
          dispatch(updateBusyState(false));
          return;
        }

        const { data } = await client.get('/auth/is-auth', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(updateProfile(data.profile));
        dispatch(updateLoggedInState(true));
      } catch (error) {
        console.log('Auth Error', error);
      } finally {
        dispatch(updateBusyState(false));
      }
    };

    fetchAuthInfo();
  }, [dispatch]);

  if (busy) {
  return (
    <View style={styles.loaderScreen}>
      <View style={styles.loaderCard}>
        <Loader color={colors.SECONDARY} size={32} />
      </View>
    </View>
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

const styles = StyleSheet.create({
  loaderScreen: {
    flex: 1,
    backgroundColor: colors.PRIMARY, // or '#0f172a' for dark feel
    justifyContent: 'center',
    alignItems: 'center',
  },

  loaderCard: {
    width: 90,
    height: 90,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center',

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 10,

    // Android shadow
    elevation: 10,
  },
});


export default RootNavigator;
