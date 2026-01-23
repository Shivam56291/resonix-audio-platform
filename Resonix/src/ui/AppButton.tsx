import { FC } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import colors from '@utils/colors';
import Loader from './Loader';

interface Props {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  busy?: boolean;
  borderRadius?: number;
}

const AppButton: FC<Props> = ({ title, onPress, disabled, busy, borderRadius }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        {borderRadius: borderRadius || 23}
      ]}
      onPress={onPress}
      disabled={disabled || busy}
    >
      {busy ? <Loader /> : <Text style={styles.title}>{title}</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
    backgroundColor: colors.SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 18,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
});

export default AppButton;
