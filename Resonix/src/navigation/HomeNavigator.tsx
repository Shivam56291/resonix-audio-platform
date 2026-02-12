import { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ScreenFadeWrapper from 'ui/ScreenFadeWrapper';
import { HomeNavigatorStackParamList } from 'src/@types/navigation';
import Home from 'views/Home';
import PublicProfile from 'views/PublicProfile';

const Stack = createNativeStackNavigator<HomeNavigatorStackParamList>();

interface Props {}

const HomeNavigator: FC<Props> = () => {
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
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="PublicProfile">
        {(props) => (
          <ScreenFadeWrapper>
            <PublicProfile {...props} />
          </ScreenFadeWrapper>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default HomeNavigator;
