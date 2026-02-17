import { ScrollView } from 'react-native';
import { FC } from 'react';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { PublicProfileTopTabParamList } from 'views/PublicProfile';
import { useFetchPublicPlaylists } from 'hooks/query';
import AudioListLoadingUI from 'ui/AudioListLoadingUI';
import EmptyRecords from 'ui/EmptyRecords';
import PlaylistItem from 'ui/PlaylistItem';

type Props = MaterialTopTabScreenProps<
  PublicProfileTopTabParamList,
  'Playlists'
>;

const PublicPlaylistsTab: FC<Props> = props => {
  const { data = [], isLoading } = useFetchPublicPlaylists(
    props.route.params.profileId,
  );

  if (isLoading) {
    return <AudioListLoadingUI items={data?.length || 11} />;
  }

  return (
    <ScrollView>
      {data?.length > 0 ? (
        data?.map(playlist => (
          <PlaylistItem key={playlist.id} playlist={playlist} />
        ))
      ) : (
        <EmptyRecords title="No Playlists Found!" />
      )}
    </ScrollView>
  );
};

export default PublicPlaylistsTab;
