import { FC } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import colors from '@utils/colors';
import { AudioData } from 'src/@types/audio';
import { hapticLight } from 'utils/haptics';
import PlayAnimation from './PlayAnimation';

interface Props {
  audio: AudioData;
  onPress?: () => void;
  isPlaying?: boolean;
}

const AudioListItem: FC<Props> = ({ audio, onPress, isPlaying = false }) => {
  const getSource = (poster?: string) => {
    return poster ? { uri: poster } : require('src/../assets/music_small.png');
  };

  const handlePress = () => {
    hapticLight();
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.listItem, pressed && styles.pressed]}
    >
      <View>
        <Image source={getSource(audio.poster)} style={styles.poster} />
        <PlayAnimation visible={isPlaying} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {audio.title}
        </Text>
        <Text style={styles.owner} numberOfLines={1} ellipsizeMode="tail">
          {audio.owner?.name ?? 'Unknown'}
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
    transform: [{ scale: 0.97 }],
    opacity: 0.6,
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
