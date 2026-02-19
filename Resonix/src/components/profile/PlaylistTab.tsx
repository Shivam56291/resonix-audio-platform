import { FC } from 'react';
import { ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';

import { useFetchPlaylist } from 'src/hooks/query';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';
import PlaylistItem from '@ui/PlaylistItem';
import { Playlist } from 'src/@types/audio';
import {
  updatePlaylistVisibility,
  updateSelectedList,
} from 'store/playlistModal';

interface Props {}

const PlaylistTab: FC<Props> = () => {
  const { data = [], isLoading } = useFetchPlaylist();
  const dispatch = useDispatch();

  if (isLoading) {
    return <AudioListLoadingUI items={data.length || 11} />;
  }

  const handleOnListPress = (playlist: Playlist) => {
    dispatch(updateSelectedList(playlist.id));
    dispatch(updatePlaylistVisibility(true));
  };

  return (
    <ScrollView>
      {data.length > 0 ? (
        data.map(playlist => (
          <PlaylistItem
            onPress={() => handleOnListPress(playlist)}
            key={playlist.id}
            playlist={playlist}
          />
        ))
      ) : (
        <EmptyRecords title="No Playlists Found!" />
      )}
    </ScrollView>
  );
};

export default PlaylistTab;
