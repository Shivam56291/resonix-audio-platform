
import { FC } from 'react';
import { ScrollView } from 'react-native';

import { useFetchPlaylist } from 'src/hooks/query';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';
import PlaylistItem from '@ui/PlaylistItem';

interface Props {}

const PlaylistTab: FC<Props> = () => {
  const { data = [], isLoading } = useFetchPlaylist();

  if (isLoading) {
    return <AudioListLoadingUI items={data.length || 11} />;
  }

  return (
    <ScrollView>
      {data.length > 0 ? (
        data.map(playlist => (
          <PlaylistItem key={playlist.id} playlist={playlist}/>
        ))
      ) : (
        <EmptyRecords title="No Playlists Found!" />
      )}
    </ScrollView>
  );
};

export default PlaylistTab;
