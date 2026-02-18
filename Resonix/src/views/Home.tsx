import { FC, useState } from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';

import LatestUploads from 'src/components/LatestUploads';
import RecommendedAudio from 'src/components/RecommendedAudio';
import OptionsModal from 'src/components/OptionsModal';
import colors from 'utils/colors';
import { AudioData, Playlist } from 'src/@types/audio';
import { getClient } from 'api/client';
import catchAsyncError from 'api/catchError';
import { updateNotification } from 'src/store/notification';
import PlaylistModal from 'components/PlaylistModal';
import PlaylistForm, { PlaylistInfo } from 'components/PlaylistForm';
import { useFetchPlaylist } from 'hooks/query';
import useAudioController from 'hooks/useAudioController';
import AppView from '@components/AppView';
import RecentlyPlayed from 'components/RecentlyPlayed';
import RecommendedPlaylist from 'components/RecommendedPlaylist';
import {
  updatePlaylistVisibility,
  updateSelectedList,
} from 'store/playlistModal';

interface Props {}

const Home: FC<Props> = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<AudioData | null>(null);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);
  const { onAudioPress } = useAudioController();

  const { data: playlistData } = useFetchPlaylist();

  const dispatch = useDispatch();

  const handleOnFavPress = async () => {
    if (!selectedAudio) return;

    try {
      const client = await getClient({});

      const { data } = await client.post(
        '/favorite?audioId=' + selectedAudio.id,
        {},
      );
      dispatch(
        updateNotification({
          message:
            data.status === 'added'
              ? 'Added to favourites'
              : 'Removed from favourites',
          type: 'success',
        }),
      );

      console.log(data);
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({ message: errorMessage, type: 'error' }));
    } finally {
      setSelectedAudio(null);
      setShowOptions(false);
    }
  };

  const handleOnLongPress = (audio: AudioData) => {
    setSelectedAudio(audio);
    setShowOptions(true);
  };

  const handleAddToPlaylist = () => {
    setShowOptions(false);
    setShowPlaylistModal(true);
  };

  const handlePlaylistSubmit = async (playlistInfo: PlaylistInfo) => {
    if (!playlistInfo.title.trim()) return;
    try {
      const client = await getClient({});

      await client.post('/playlist/create', {
        resId: selectedAudio?.id,
        title: playlistInfo.title,
        visibility: playlistInfo.private ? 'private' : 'public',
      });

      dispatch(
        updateNotification({
          message: 'Playlist created successfully',
          type: 'success',
        }),
      );
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({ message: errorMessage, type: 'error' }));
    } finally {
      setShowPlaylistForm(false);
    }
  };

  const updatePlaylist = async (playlist: Playlist) => {
    try {
      const client = await getClient({});

      await client.patch('/playlist', {
        id: playlist.id,
        item: selectedAudio?.id,
        title: playlist.title,
        visibility: playlist.visibility,
      });

      dispatch(
        updateNotification({
          message: 'Added to playlist',
          type: 'success',
        }),
      );
      setSelectedAudio(null);
      setShowPlaylistModal(false);
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({ message: errorMessage, type: 'error' }));
    } finally {
      setShowPlaylistModal(false);
    }
  };

  const handleOnListPress = (playlist: Playlist) => {
    dispatch(updateSelectedList(playlist.id));
    console.log("Playlist : ", playlist)
    dispatch(updatePlaylistVisibility(true));
  };

  return (
    <AppView>
      <ScrollView contentContainerStyle={styles.container}>
        <RecentlyPlayed />

        <View style={styles.sectionDivider} />

        <LatestUploads
          onAudioPress={onAudioPress}
          onAudioLongPress={handleOnLongPress}
        />

        <View style={styles.sectionDivider} />

        <RecommendedAudio
          onAudioPress={onAudioPress}
          onAudioLongPress={handleOnLongPress}
        />

        <View style={styles.sectionDivider} />

        <RecommendedPlaylist onListPress={handleOnListPress} />

        <OptionsModal
          visible={showOptions}
          onRequestClose={() => setShowOptions(false)}
          options={[
            {
              title: 'Add to Playlist',
              icon: 'playlist-music', // 'playlist-plus
              onPress: handleAddToPlaylist,
            },
            {
              title: 'Add to Favourites',
              icon: 'cards-heart', // 'heart-plus'
              onPress: handleOnFavPress,
            },
          ]}
          renderItem={item => (
            <Pressable style={styles.optionContainer} onPress={item.onPress}>
              <MaterialCommunityIcons
                name={item.icon}
                size={24}
                color={colors.PRIMARY}
              />
              <Text style={styles.optionLabel}>{item.title}</Text>
            </Pressable>
          )}
        />

        <PlaylistModal
          visible={showPlaylistModal}
          onRequestClose={() => setShowPlaylistModal(false)}
          list={playlistData || []}
          onCreateNewPress={() => {
            setShowPlaylistModal(false);
            setShowPlaylistForm(true);
          }}
          onPlaylistPress={updatePlaylist}
        />

        <PlaylistForm
          visible={showPlaylistForm}
          onRequestClose={() => setShowPlaylistForm(false)}
          onSubmit={handlePlaylistSubmit}
        />
      </ScrollView>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {},
  optionContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
  },
  optionLabel: {
    color: colors.PRIMARY,
    fontSize: 16,
    marginLeft: 7,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: colors.OVERLAY,
    marginHorizontal: 12,
    marginVertical: 5,
  },
});

export default Home;
