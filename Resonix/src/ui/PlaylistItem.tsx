import { FC } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';

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

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.posterContainer}>
        <MaterialCommunityIcons
          name="playlist-music"
          size={30}
          color={colors.CONTRAST}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
          {title}
        </Text>
        <View style={styles.iconContainer}>
          <FontAwesome
            name={visibility === 'public' ? 'globe' : 'lock'}
            size={15}
            color={colors.SECONDARY}
          />
          <Text style={styles.count}>
            {itemsCount} {itemsCount > 1 ? 'Audios' : 'Audio'}
          </Text>
        </View>
      </View>
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
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginLeft: 10,
  },
  posterContainer: {
    aspectRatio: 1,
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.OVERLAY,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
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
