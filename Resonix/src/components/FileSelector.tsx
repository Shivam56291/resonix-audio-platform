import { Text, Pressable, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { FC, ReactNode } from 'react';

import colors from '../utils/colors';

interface Props {
  title: string;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const FileSelector: FC<Props> = props => {
  return (
    <Pressable
      style={({ pressed }) => [styles.btnContainer, pressed && styles.pressed, props.style]}
    >
      <View style={styles.iconContainer}>{props.icon}</View>
      <Text style={styles.btnTitle}>{props.title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    height: 70,
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  btnTitle: {
    color: colors.CONTRAST,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default FileSelector;
