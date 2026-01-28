import { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Profile from '@views/Profile';
import ProfileSettings from '@components/profile/ProfileSettings';
import ScreenFadeWrapper from 'ui/ScreenFadeWrapper';

const Stack = createNativeStackNavigator();

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
      <Stack.Screen name="ProfileScreen" component={Profile} />
      <Stack.Screen name="ProfileSettings">
        {() => (
          <ScreenFadeWrapper>
            <ProfileSettings />
          </ScreenFadeWrapper>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
