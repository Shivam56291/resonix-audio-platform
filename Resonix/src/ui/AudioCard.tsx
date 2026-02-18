import { FC } from 'react';
import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import colors from 'src/utils/colors';
import PlayAnimation from './PlayAnimation';

interface Props {
  title: string;
  poster?: string;
  onPress?: () => void;
  onLongPress?: () => void;
  playing?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const AudioCard: FC<Props> = ({
  title,
  poster,
  onPress,
  onLongPress,
  playing = false,
  containerStyle,
}) => {
  const source = poster ? { uri: poster } : require('../../assets/music.png');

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        containerStyle ? containerStyle : styles.audioContainer,
        pressed && { transform: [{ scale: 0.96 }], opacity: 0.9 },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image source={source} style={styles.image} />

        {playing && (
          <View style={styles.overlayContainer}>
            <PlayAnimation visible={playing} />
          </View>
        )}
      </View>

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
    height: '100%',
    width: '100%',
  },
  imageContainer: {
    aspectRatio: 1,
    width: '100%',
    borderRadius: 7,
    overflow: 'hidden',
  },
  audioContainer: {
    width: 100,
    marginHorizontal: 6,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
  },
});

export default AudioCard;
