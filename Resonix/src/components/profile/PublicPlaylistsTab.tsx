import { ScrollView } from 'react-native';
import { FC } from 'react';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { PublicProfileTopTabParamList } from 'views/PublicProfile';
import { useFetchPublicPlaylists } from 'hooks/query';
import AudioListLoadingUI from 'ui/AudioListLoadingUI';
import EmptyRecords from 'ui/EmptyRecords';
import PlaylistItem from 'ui/PlaylistItem';
import { useDispatch } from 'react-redux';
import {
  updatePlaylistVisibility,
  updateSelectedList,
} from 'store/playlistModal';
import { Playlist } from 'src/@types/audio';

type Props = MaterialTopTabScreenProps<
  PublicProfileTopTabParamList,
  'Playlists'
>;

const PublicPlaylistsTab: FC<Props> = props => {
  const { data = [], isLoading } = useFetchPublicPlaylists(
    props.route.params.profileId,
  );
  const dispatch = useDispatch();

  if (isLoading) {
    return <AudioListLoadingUI items={data?.length || 11} />;
  }

  const handleOnListPress = (playlist: Playlist) => {
    dispatch(updateSelectedList(playlist.id));
    dispatch(updatePlaylistVisibility(true));
  };

  return (
    <ScrollView>
      {data?.length > 0 ? (
        data?.map(playlist => (
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

export default PublicPlaylistsTab;
