import { FC } from 'react';
import { Image, Pressable, StyleSheet, Text } from 'react-native';

import colors from 'src/utils/colors';

interface Props {
  title: string;
  poster?: string;
  onPress?: () => void;
  onLongPress?: () => void;
}

const AudioCard: FC<Props> = ({ title, poster, onPress, onLongPress }) => {
  const source = poster ? { uri: poster } : require('../../assets/music.png');

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.96 : 1 }],
        opacity: pressed ? 0.9 : 1,
        ...styles.audioContainer,
      })}
    >
      <Image source={source} style={styles.image} />
      <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  title: {
    color: colors.CONTRAST,
    fontWeight: '500',
    fontSize: 16,
    marginTop: 5,
  },
  image: {
    aspectRatio: 1,
    height: 100,
    borderRadius: 7,
  },
  audioContainer: {
    width: 100,
    marginHorizontal: 12,
  },
});

export default AudioCard;
