import { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSelector } from 'react-redux';
import { getAuthState } from 'store/auth';

import UploadTab from '@components/profile/UploadTab';
import PlaylistTab from '@components/profile/PlaylistTab';
import FavoriteTab from '@components/profile/FavoriteTab';
import HistoryTab from '@components/profile/HistoryTab';
import colors from '@utils/colors';
import ProfileContainer from '@components/ProfileContainer';
import AnimatedTabScreenWrapper from 'ui/AnimatedTabScreenWrapper';

interface Props {}

const Tab = createMaterialTopTabNavigator();

const Profile: FC<Props> = () => {
  const { profile } = useSelector(getAuthState);

  return (
    <View style={styles.container}>
      <ProfileContainer profile={profile} />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBarStyles,
          tabBarLabelStyle: styles.tabBarLabelStyle,
          tabBarIndicatorStyle: { backgroundColor: colors.SECONDARY },
        }}
      >
        <Tab.Screen name="Uploads">
          {() => (
            <AnimatedTabScreenWrapper>
              <UploadTab />
            </AnimatedTabScreenWrapper>
          )}
        </Tab.Screen>

        <Tab.Screen name="Playlists">
          {() => (
            <AnimatedTabScreenWrapper>
              <PlaylistTab />
            </AnimatedTabScreenWrapper>
          )}
        </Tab.Screen>

        <Tab.Screen name="Favourites">
          {() => (
            <AnimatedTabScreenWrapper>
              <FavoriteTab />
            </AnimatedTabScreenWrapper>
          )}
        </Tab.Screen>

        <Tab.Screen name="History">
          {() => (
            <AnimatedTabScreenWrapper>
              <HistoryTab />
            </AnimatedTabScreenWrapper>
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  tabBarStyles: {
    marginBottom: 20,
    backgroundColor: 'transparent',
    elevation: 0,
    shadowColor: 'transparent',
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
  },
  tabBarLabelStyle: {
    color: colors.CONTRAST,
    fontSize: 12,
    letterSpacing: 0.85,
  },
});

export default Profile;
