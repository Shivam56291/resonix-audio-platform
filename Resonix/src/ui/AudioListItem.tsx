import { FC } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import colors from '@utils/colors';
import { AudioData } from 'src/@types/audio';

interface Props {
  audio: AudioData;
  onPress?: () => void;
}

const AudioListItem: FC<Props> = ({ audio, onPress }) => {
  const getSource = (poster?: string) => {
    return poster ? { uri: poster } : require('src/../assets/music_small.png');
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.listItem, pressed && styles.pressed]}
    >
      <Image source={getSource(audio.poster)} style={styles.poster} />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {audio.title}
        </Text>
        <Text style={styles.owner} numberOfLines={1} ellipsizeMode="tail">
          {audio.owner.name}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    backgroundColor: colors.OVERLAY,
    marginBottom: 15,
    borderRadius: 5,
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.SECONDARY,
  },
  pressed: {
    opacity: 0.5,
  },
  poster: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  infoContainer: {
    flex: 1,
    padding: 5,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.CONTRAST,
    textTransform: 'capitalize',
  },
  owner: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.SECONDARY,
    textTransform: 'capitalize',
  },
});

export default AudioListItem;
