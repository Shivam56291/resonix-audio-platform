import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';

import Home from '@views/Home';
import Profile from '@views/Profile';
import Upload from '@views/Upload';
import colors from '@utils/colors';

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
        animation: 'fade',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.PRIMARY,
        },
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={Home}
        options={{
          tabBarIcon: HomeTabIcon,
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={Profile}
        options={{
          tabBarIcon: ProfileTabIcon,
        }}
      />
      <Tab.Screen
        name="UploadScreen"
        component={Upload}
        options={{
          tabBarIcon: UploadTabIcon,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
