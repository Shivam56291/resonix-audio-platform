import { FC } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';

import AvatarField from '@ui/AvatarField';
import colors from '@utils/colors';
import { PublicProfile } from 'src/@types/user';
import { useFetchIsFollowing } from 'hooks/query';
import { getClient } from 'api/client';
import catchAsyncError from 'api/catchError';
import { useDispatch } from 'react-redux';
import { updateNotification } from 'store/notification';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface Props {
  profile?: PublicProfile;
}

const PublicProfileContainer: FC<Props> = ({ profile }) => {
  const { data: isFollowing } = useFetchIsFollowing(profile?.id || '');
  const dispatch = useDispatch();
  const queryclient = useQueryClient();

  const followingMutation = useMutation({
    mutationFn: async id => toggleFollowing(id),
    onMutate: (id: string) => {
      queryclient.setQueryData<boolean>(['is-following', id], prev => !prev);
    },
  });

  const toggleFollowing = async (id: string) => {
    try {
      if (!id) return;
      const client = await getClient();
      await client.post('/profile/update-follower' + id);
      queryclient.invalidateQueries({ queryKey: ['profile', id] });
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({ message: errorMessage, type: 'error' }));
    }
  };

  if (!profile) {
    return null;
  }
  return (
    <View style={styles.container}>
      <AvatarField source={profile.avatar} />

      <View>
        <Text style={styles.profileName}>{profile.name}</Text>
        <Text style={styles.followerText}>{profile.followers} Followers</Text>

        <Pressable
          onPress={() => followingMutation.mutate(profile.id)}
          style={({ pressed }) => [
            styles.profileActionContainer,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.profileActionLink}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Text>
        </Pressable>
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
  followerText: {
    color: colors.CONTRAST,
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
    opacity: 0.6,
    transform: [{ scale: 0.95 }],
  },
});

export default PublicProfileContainer;
