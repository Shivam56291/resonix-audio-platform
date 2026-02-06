import { FC } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { Playlist } from 'src/@types/audio';
import colors from '@utils/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface Props {
  playlist: Playlist;
  onPress?: () => void;
}

const PlaylistItem: FC<Props> = ({ playlist, onPress }) => {
  const { title, visibility, itemsCount } = playlist;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => (scale.value = withSpring(0.96, { damping: 15 }))}
      onPressOut={() => (scale.value = withSpring(1, { damping: 15 }))}
      onPress={onPress}
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.posterContainer}>
          <MaterialCommunityIcons
            name="playlist-music"
            size={26}
            color={colors.CONTRAST}
          />
        </View>

        <View style={styles.contentContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>

          <View style={styles.iconContainer}>
            <FontAwesome
              name={visibility === 'public' ? 'globe' : 'lock'}
              size={14}
              color={colors.SECONDARY}
            />
            <Text style={styles.count}>
              {itemsCount} {itemsCount > 1 ? 'Audios' : 'Audio'}
            </Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 5,
    gap: 10,
    overflow: 'hidden',
    backgroundColor: colors.OVERLAY,
    marginBottom: 15,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.SECONDARY,
  },
  pressed: {
    opacity: 0.5,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 5,
  },
  count: {
    color: colors.SECONDARY,
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'capitalize',
    marginLeft: 10,
  },
  posterContainer: {
    height: 52,
    width: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.CONTRAST,
    textTransform: 'capitalize',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
  },
});

export default PlaylistItem;
