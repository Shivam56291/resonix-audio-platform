import { FC } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import AvatarField from '@ui/AvatarField';
import colors from '@utils/colors';
import { PublicProfile } from 'src/@types/user';

interface Props {
  profile?: PublicProfile;
}

const PublicProfileContainer: FC<Props> = ({ profile }) => {

  if (!profile) {
    return null;
  }
  return (
    <View style={styles.container}>
      <AvatarField source={profile.avatar} />

      <View>
        <Text style={styles.profileName}>{profile.name}</Text>

        <View style={styles.profileActionContainer}>
          <Text style={styles.profileActionLink}>
            {profile.followers} Followers
          </Text>
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.CONTRAST,
    textTransform: 'capitalize',
  },
  profileEmail: {
    fontSize: 14,
    color: colors.SECONDARY,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  profileActionLink: {
    backgroundColor: colors.SECONDARY,
    padding: 5,
    borderRadius: 5,
    color: colors.PRIMARY,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginTop: 5,
  },
  profileActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 17,
  },
  pressed: {
    opacity: 0.5,
    transform: [{ scale: 0.95 }],
  },
});

export default PublicProfileContainer;
