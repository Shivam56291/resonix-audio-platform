import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import Upload from '@views/Upload';
import colors from '@utils/colors';
import ScreenFadeWrapper from '@ui/ScreenFadeWrapper';
import ProfileNavigator from './ProfileNavigator';
import { hapticLight } from 'utils/haptics';
import { Pressable } from 'react-native';
import HomeNavigator from './HomeNavigator';

const AnimatedTabIcon = ({ focused, children }: any) => {
  const style = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(focused ? 1.15 : 1, {
          damping: 14,
          stiffness: 320,
          mass: 0.35,
        }),
      },
    ],
  }));

  const pillStyle = useAnimatedStyle(() => ({
    opacity: withSpring(focused ? 1 : 0),
    transform: [
      {
        scale: withSpring(focused ? 1 : 0.6, {
          damping: 18,
          stiffness: 260,
        }),
      },
    ],
  }));

  return (
    <Animated.View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: 64,
            height: 42,
            borderRadius: 15,
            backgroundColor: 'rgba(255,255,255,0.07)',
          },
          pillStyle,
        ]}
      />

      <Animated.View style={style}>{children}</Animated.View>
    </Animated.View>
  );
};

const Tab = createBottomTabNavigator();

type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

const HomeTabIcon = ({ focused, color, size }: TabBarIconProps) => (
  <AnimatedTabIcon focused={focused}>
    <AntDesign name="home" color={color} size={size} />
  </AnimatedTabIcon>
);

const ProfileTabIcon = ({ focused, color, size }: TabBarIconProps) => (
  <AnimatedTabIcon focused={focused}>
    <Feather name="user" color={color} size={size} />
  </AnimatedTabIcon>
);

const UploadTabIcon = ({ focused, color, size }: TabBarIconProps) => (
  <AnimatedTabIcon focused={focused}>
    <MaterialIcons name="queue-music" color={color} size={size + 3} />
  </AnimatedTabIcon>
);

const HapticTabButton = (props: any) => {
  return (
    <Pressable
      {...props}
      onPress={e => {
        hapticLight();
        props.onPress?.(e);
      }}
    />
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarButton: props => <HapticTabButton {...props} />,
        tabBarActiveTintColor: colors.CONTRAST,
        tabBarInactiveTintColor: colors.SECONDARY,
        tabBarStyle: {
          backgroundColor: colors.PRIMARY,
          borderTopWidth: 0,
          height: 64,
        },
      }}
    >
      <Tab.Screen
        name="HomeNavigator"
        options={{ tabBarIcon: HomeTabIcon, title: 'Home' }}
      >
        {() => (
          <ScreenFadeWrapper>
            <HomeNavigator />
          </ScreenFadeWrapper>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="ProfileScreen"
        options={{
          tabBarIcon: ProfileTabIcon,
          title: 'Profile',
        }}
      >
        {() => (
          <ScreenFadeWrapper>
            <ProfileNavigator />
          </ScreenFadeWrapper>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="UploadScreen"
        options={{ tabBarIcon: UploadTabIcon, title: 'Upload' }}
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
