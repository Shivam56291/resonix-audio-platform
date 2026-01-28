import { PermissionsAndroid, Platform } from 'react-native';

export const getPermissionToReadImages = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;

  try {
    const permission =
      Platform.Version >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const granted = await PermissionsAndroid.request(permission, {
      title: 'Permission to access images',
      message: 'We need your permission to access photos on your device.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.log('Permission error:', error);
    return false;
  }
};
