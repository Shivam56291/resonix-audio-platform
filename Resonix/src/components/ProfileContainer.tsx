import { FC } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { UserProfile } from 'store/auth';
import AvatarField from '@ui/AvatarField';
import colors from '@utils/colors';

interface Props {
  profile?: UserProfile | null;
}

const ProfileContainer: FC<Props> = ({ profile }) => {
  if (!profile) {
    return null;
  }
  return (
    <View style={styles.container}>
      <AvatarField source={profile.avatar} />

      <View>
        <Text style={styles.profileName}>{profile.name}</Text>
        <View style={styles.emailContainer}>
          <Text style={styles.profileEmail}>{profile.email}</Text>
          <MaterialIcons
            name="verified"
            size={20}
            color={colors.SECONDARY}
          />
        </View>
        <View style={styles.profileActionContainer}>
          <Text style={styles.profileActionLink}>{profile.followers} Followers</Text>
          <Text style={styles.profileActionLink}>{profile.followings} Followings</Text>
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
});

export default ProfileContainer;
