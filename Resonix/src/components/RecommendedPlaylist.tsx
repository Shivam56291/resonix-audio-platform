import { FC } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useFetchRecommendedPlaylist } from '../hooks/query';
import colors from '../utils/colors';
import { Playlist } from 'src/@types/audio';

interface Props {
  onListPress: (playlist: Playlist) => void;
}

const RecommendedPlaylist: FC<Props> = ({ onListPress }) => {
  const { data } = useFetchRecommendedPlaylist();
  return (
    <>
      <View>
        <Text style={styles.title}>Playlist For You</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onListPress(item)}
              style={styles.container}
            >
              <Image
                source={require('../../assets/music.png')}
                style={styles.poster}
              />
              <View style={styles.overlay}>
                <Text style={styles.playlistTitle}>{item.title}</Text>
                <Text style={styles.playlistAudiosCount}>
                  {item.itemsCount} Audios
                </Text>
              </View>
            </Pressable>
          )}
        />
      </View>
      <View style={{ height: 80 }} />
    </>
  );
};

const cardSize = 150;

const styles = StyleSheet.create({
  container: {
    width: cardSize,
    height: cardSize,
    marginLeft: 15,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1E1E1E',
  },

  title: {
    color: colors.CONTRAST,
    borderBottomWidth: 1,
    borderBottomColor: colors.SECONDARY,
    letterSpacing: 0.3,
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 10,
    marginBottom: 15,
    alignSelf: 'flex-start',
    marginLeft: 13,
  },

  poster: {
    width: cardSize,
    height: cardSize,
  },

  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 12,
    borderWidth: 0.1,
    borderColor: 'rgba(255, 170, 51, 0.6)',
  },

  playlistTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.CONTRAST,
  },

  playlistAudiosCount: {
    fontSize: 12,
    color: colors.INACTIVE_CONTRAST,
    marginTop: 2,
  },
});

export default RecommendedPlaylist;
