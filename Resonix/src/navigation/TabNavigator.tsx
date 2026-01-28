import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';

import Home from '@views/Home';
import Upload from '@views/Upload';
import colors from '@utils/colors';
import ScreenFadeWrapper from '@ui/ScreenFadeWrapper';
import ProfileNavigator from './ProfileNavigator';

const Tab = createBottomTabNavigator();

type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

const HomeTabIcon = ({ color, size }: TabBarIconProps) => (
  <AntDesign name="home" color={color} size={size} />
);

const ProfileTabIcon = ({ color, size }: TabBarIconProps) => (
  <Feather name="user" color={color} size={size} />
);

const UploadTabIcon = ({ color, size }: TabBarIconProps) => (
  <MaterialIcons name="queue-music" color={color} size={size + 3} />
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        animation: 'none', // let our wrapper handle animation
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.PRIMARY,
        },
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        options={{ tabBarIcon: HomeTabIcon }}
      >
        {() => (
          <ScreenFadeWrapper>
            <Home />
          </ScreenFadeWrapper>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="ProfileNavigator"
        options={{ tabBarIcon: ProfileTabIcon }}
      >
        {() => (
          <ScreenFadeWrapper>
            <ProfileNavigator />
          </ScreenFadeWrapper>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="UploadScreen"
        options={{ tabBarIcon: UploadTabIcon }}
      >
        {() => (
          <ScreenFadeWrapper>
            <Upload />
          </ScreenFadeWrapper>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};


export default TabNavigator;
