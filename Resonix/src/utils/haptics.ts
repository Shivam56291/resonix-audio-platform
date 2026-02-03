import Haptic from 'react-native-haptic-feedback';

const options = {
  enableVibrateFallback: false,
  ignoreAndroidSystemSettings: false,
};

export const hapticLight = () => {
  Haptic.trigger('impactLight', options);
};

export const hapticMedium = () => {
  Haptic.trigger('impactMedium', options);
};
