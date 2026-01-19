import { FC } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import colors from '@utils/colors';

interface Props {
  title: string;
  onPress?: () => void;
}

const AppButton: FC<Props> = ({ title, onPress }) => {
  return (
    <Pressable style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
    backgroundColor: colors.SECONDARY,
    borderRadius: 23,
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
});

export default AppButton;
