import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LostPassword from 'views/auth/LostPassword';
import { useSelector } from 'react-redux';

import SignIn from 'views/auth/SignIn';
import SignUp from 'views/auth/SignUp';
import Verification from 'views/auth/Verification';
import { AuthStackParamList } from '../@types/navigation';
import { getAuthState } from 'src/store/auth';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  const authState = useSelector(getAuthState);
  console.log(authState);
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="LostPassword" component={LostPassword} />
      <Stack.Screen name="Verification" component={Verification} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
