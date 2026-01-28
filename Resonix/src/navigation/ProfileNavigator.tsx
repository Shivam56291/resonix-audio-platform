import { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Profile from '@views/Profile';
import ProfileSettings from '@components/profile/ProfileSettings';
import ScreenFadeWrapper from 'ui/ScreenFadeWrapper';
import Verification from '@views/auth/Verification';
import { ProfileNavigatorStackParamList } from 'src/@types/navigation';

const Stack = createNativeStackNavigator<ProfileNavigatorStackParamList>();

interface Props {}

const ProfileNavigator: FC<Props> = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 150,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ProfileSettings">
        {() => (
          <ScreenFadeWrapper>
            <ProfileSettings />
          </ScreenFadeWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen name="Verification" component={Verification} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
