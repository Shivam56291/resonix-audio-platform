import { FC } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

import colors from '@utils/colors';

interface Props {
  title: string;
  onPress?: () => void;
}

const AppLink: FC<Props> = ({ title, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
      })}
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
