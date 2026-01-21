import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import { getAuthState, updateBusyState } from 'src/store/auth';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import { getFromAsyncStorage, Keys } from 'utils/asyncStorage';
import client from 'src/api/client';
import { updateProfile, updateLoggedInState } from 'src/store/auth';
import Loader from 'ui/Loader';
import colors from 'utils/colors';

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
        console.log('Auth error : ', error);
      } finally {
        dispatch(updateBusyState(false));
      }
    };
    fetchAuthInfo();
  }, [dispatch]);


  if (busy) {
    return (
      <View style={styles.loaderContainer}>
        <Loader size={60} color={colors.SECONDARY} />
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

export default RootNavigator;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.PRIMARY, 
  },
  // loaderContainer: {
  //   ...StyleSheet.absoluteFillObject,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: colors.OVERLAY,
  //   zIndex: 1,
  // },
});