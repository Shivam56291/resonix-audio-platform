import { FC } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';

import AppHeader from '@components/AppHeader';
import colors from '@utils/colors';
import AvatarField from '@ui/AvatarField';
import AppButton from '@ui/AppButton';
import { getClient } from 'src/api/client';
import catchAsyncError from 'src/api/catchError';
import { updateNotification } from '@store/notification';
import { Keys, removeFromAsyncStorage } from '@utils/asyncStorage';
import {
  updateProfile,
  updateLoggedInState,
  updateBusyState,
} from '@store/auth';

interface Props {}

const ProfileSettings: FC<Props> = () => {
  const dispatch = useDispatch();

  const handleLogout = async (fromAll?: boolean) => {
    dispatch(updateBusyState(true));
    const endpoint = `/auth/log-out?fromAll=${fromAll ? 'yes' : ''}`;
    try {
      const client = await getClient();
      await client.post(endpoint);

      await removeFromAsyncStorage(Keys.AUTH_TOKEN);
      dispatch(updateProfile(null));
      dispatch(updateLoggedInState(false));
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(
        updateNotification({
          message: errorMessage,
          type: 'error',
        }),
      );
    } finally {
      dispatch(updateBusyState(false));
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Settings" />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Profile Settings</Text>
      </View>

      <View style={styles.settingOptionsContainer}>
        <View style={styles.avatarContainer}>
          <AvatarField />
          <Pressable
            style={({ pressed }) => [
              styles.paddingLeft,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.linkText}>Update Profile Image</Text>
          </Pressable>
        </View>
        <TextInput
          style={styles.nameInput}
          placeholder="Name"
          value="John Doe"
        />
        <View style={styles.emailContainer}>
          <Text style={styles.emailText}>john@email.com</Text>
          <MaterialIcon name="verified" size={20} color={colors.SECONDARY} />
        </View>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Logout</Text>
      </View>

      <View style={styles.settingOptionsContainer}>
        <Pressable
          onPress={() => handleLogout(true)}
          style={({ pressed }) => [styles.logoutBtn, pressed && styles.pressed]}
        >
          <Ionicons name="log-out-outline" size={24} color={colors.CONTRAST} />
          <Text style={styles.logoutBtnTitle}>Logout From All Devices</Text>
        </Pressable>

        <View
          style={{
            height: 0.5,
            backgroundColor: colors.SECONDARY,
            opacity: 0.3,
            marginTop: 15,
            marginRight: 135,
          }}
        />

        <Pressable
          onPress={() => handleLogout()}
          style={({ pressed }) => [styles.logoutBtn, pressed && styles.pressed]}
        >
          <Ionicons name="log-out-outline" size={24} color={colors.CONTRAST} />
          <Text style={styles.logoutBtnTitle}>Logout</Text>
        </Pressable>
      </View>

      <View style={styles.submitBtnContainer}>
        <AppButton title="Update" borderRadius={7} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  titleContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.SECONDARY,
    paddingBottom: 5,
    marginTop: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: colors.SECONDARY,
  },
  settingOptionsContainer: {
    marginTop: 20,
    paddingLeft: 15,
  },
  paddingLeft: {
    paddingLeft: 15,
  },
  pressed: {
    opacity: 0.6,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    color: colors.SECONDARY,
    fontStyle: 'italic',
    padding: 5,
    paddingVertical: 8,
  },
  nameInput: {
    color: colors.CONTRAST,
    fontWeight: 'bold',
    fontSize: 18,
    padding: 10,
    borderWidth: 0.5,
    borderColor: colors.CONTRAST,
    borderRadius: 7,
    marginTop: 15,
    marginRight: 10,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  emailText: {
    color: colors.CONTRAST,
    marginHorizontal: 12,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  logoutBtnTitle: {
    color: colors.CONTRAST,
    fontSize: 18,
    marginHorizontal: 12,
  },
  submitBtnContainer: {
    marginTop: 60,
    marginHorizontal: 12,
  },
});

export default ProfileSettings;
