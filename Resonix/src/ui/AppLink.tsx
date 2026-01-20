import { FC } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

import colors from '@utils/colors';

interface Props {
  title: string;
  onPress?: () => void;
  active?: boolean;
}

const AppLink: FC<Props> = ({ title, onPress, active }) => {
  return (
    <Pressable
      onPress={active === false ? undefined : onPress}
      style={({ pressed }) => {
        if (active === undefined) {
          return { opacity: pressed ? 0.7 : 1 };
        }
        return {
          opacity: active ? (pressed ? 0.7 : 1) : 0.4,
        };
      }}
    >
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  title: {
    color: colors.SECONDARY,
  },
});

export default AppLink;
