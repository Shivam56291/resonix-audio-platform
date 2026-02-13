import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AppView from 'components/AppView';
import { useFetchPublicProfile } from 'hooks/query';
import { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { HomeNavigatorStackParamList } from 'src/@types/navigation';
import PublicProfileContainer from 'components/profile/PublicProfileContainer';
import colors from '@utils/colors';

import AnimatedTabScreenWrapper from '@ui/AnimatedTabScreenWrapper';
import PublicUploadsTab from '@components/profile/PublicUploadsTab';
import PublicPlaylistsTab from '@components/profile/PublicPlaylistsTab';

const Tab = createMaterialTopTabNavigator();

type Props = NativeStackScreenProps<
  HomeNavigatorStackParamList,
  'PublicProfile'
>;

const PublicProfile: FC<Props> = ({ route }) => {
  const { profileId } = route.params;
  const { data } = useFetchPublicProfile(profileId);

  return (
    <AppView>
      <View style={styles.container}>
        <PublicProfileContainer profile={data} />

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
                <PublicUploadsTab />
              </AnimatedTabScreenWrapper>
            )}
          </Tab.Screen>

          <Tab.Screen name="Playlists">
            {() => (
              <AnimatedTabScreenWrapper>
                <PublicPlaylistsTab />
              </AnimatedTabScreenWrapper>
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    </AppView>
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
    fontSize: 15,
    letterSpacing: 0.85,
  },
});

export default PublicProfile;
