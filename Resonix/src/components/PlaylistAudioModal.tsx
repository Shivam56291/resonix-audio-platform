import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppModal from 'ui/AppModal';
import {
  getPlaylistModalState,
  updatePlaylistVisibility,
} from 'store/playlistModal';
import { useFetchPlaylistAudios } from 'hooks/query';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import AudioListItem from 'ui/AudioListItem';
import colors from 'utils/colors';
import AudioListLoadingUI from 'ui/AudioListLoadingUI';
import { getPlayerState } from 'store/player';
import useAudioController from 'hooks/useAudioController';

interface Props {}

const PlaylistAudioModal: FC<Props> = () => {
  const { visible, selectedListId } = useSelector(getPlaylistModalState);
  const dispatch = useDispatch();
  const { onGoingAudio } = useSelector(getPlayerState);
  const { onAudioPress } = useAudioController();

  const { data, isLoading } = useFetchPlaylistAudios(selectedListId || '');

  const handleClose = () => {
    dispatch(updatePlaylistVisibility(false));
  };

  if (isLoading)
    return (
      <AppModal visible={visible} onRequestClose={handleClose}>
        <View style={styles.container}>
          <AudioListLoadingUI />
        </View>
      </AppModal>
    );

  return (
    <AppModal visible={visible} onRequestClose={handleClose}>
      <Text style={styles.title}>{data?.title}</Text>
      <FlatList
        contentContainerStyle={styles.container}
        data={data?.audios}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <AudioListItem
            onPress={() => onAudioPress(item, data?.audios || [])}
            isPlaying={onGoingAudio?.id === item.id}
            audio={item}
          />
        )}
      />
    </AppModal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  title: {
    color: colors.CONTRAST,
    fontWeight: 'bold',
    fontSize: 18,
    padding: 15,
    borderBottomWidth: 0.4,
    borderBottomColor: colors.SECONDARY,
  },
});

export default PlaylistAudioModal;
